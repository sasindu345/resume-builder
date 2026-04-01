import type { RefObject } from 'react';

/**
 * PDF export via the browser's native print dialog.
 *
 * This keeps the real preview DOM in place so the browser prints the exact
 * same Tailwind/CSS-module-styled layout the user already sees on screen.
 */

const PRINT_ATTR = 'data-pdf-print-target';
const PRINT_STYLE_ID = 'pdf-export-print-styles';

const PRINT_CSS = `
@page {
    size: A4 portrait;
    margin: 0;
}

@media print {
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
        min-height: 297mm !important;
        overflow: visible !important;
        background: #ffffff !important;
    }

    body * {
        visibility: hidden !important;
    }

    [${PRINT_ATTR}],
    [${PRINT_ATTR}] * {
        visibility: visible !important;
    }

    [${PRINT_ATTR}] {
        position: fixed !important;
        inset: 0 auto auto 0 !important;
        width: 210mm !important;
        min-height: 297mm !important;
        max-width: none !important;
        margin: 0 !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        background: #ffffff !important;
        z-index: 2147483647 !important;
    }

    *,
    *::before,
    *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        animation: none !important;
        transition: none !important;
    }
}
`;

function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'resume';
}

function collectHiddenAncestors(element: HTMLElement): HTMLElement[] {
    const hiddenAncestors: HTMLElement[] = [];
    let current = element.parentElement;

    while (current && current !== document.body) {
        if (current.classList.contains('hidden')) {
            current.classList.remove('hidden');
            hiddenAncestors.push(current);
        }

        current = current.parentElement;
    }

    return hiddenAncestors;
}

async function waitForPrintLayout(): Promise<void> {
    if (document.fonts) {
        await document.fonts.ready;
    }

    await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
        });
    });
}

export async function exportResumePDF(
    previewRef: RefObject<HTMLElement | null>,
    fileName: string,
): Promise<void> {
    const previewEl = previewRef.current;
    if (!previewEl) {
        throw new Error('Preview element not found');
    }

    const existingStyle = document.getElementById(PRINT_STYLE_ID);
    existingStyle?.remove();

    const hiddenAncestors = collectHiddenAncestors(previewEl);
    const previousTitle = document.title;
    const safeTitle = sanitizeFileName(fileName);

    previewEl.setAttribute(PRINT_ATTR, 'true');
    document.title = safeTitle;

    const styleEl = document.createElement('style');
    styleEl.id = PRINT_STYLE_ID;
    styleEl.textContent = PRINT_CSS;
    document.head.appendChild(styleEl);

    let cleanedUp = false;
    const mediaQueryList = typeof window.matchMedia === 'function'
        ? window.matchMedia('print')
        : null;

    const cleanup = () => {
        if (cleanedUp) {
            return;
        }

        cleanedUp = true;
        previewEl.removeAttribute(PRINT_ATTR);
        styleEl.remove();
        document.title = previousTitle;
        hiddenAncestors.forEach((ancestor) => ancestor.classList.add('hidden'));

        window.removeEventListener('afterprint', handleAfterPrint);

        if (mediaQueryList) {
            if (typeof mediaQueryList.removeEventListener === 'function') {
                mediaQueryList.removeEventListener('change', handleMediaChange);
            } else {
                mediaQueryList.removeListener(handleLegacyMediaChange);
            }
        }
    };

    const handleAfterPrint = () => {
        cleanup();
    };

    const handleMediaChange = (event: MediaQueryListEvent) => {
        if (!event.matches) {
            cleanup();
        }
    };

    const handleLegacyMediaChange = (event: MediaQueryListEvent) => {
        handleMediaChange(event);
    };

    window.addEventListener('afterprint', handleAfterPrint, { once: true });

    if (mediaQueryList) {
        if (typeof mediaQueryList.addEventListener === 'function') {
            mediaQueryList.addEventListener('change', handleMediaChange);
        } else {
            mediaQueryList.addListener(handleLegacyMediaChange);
        }
    }

    await waitForPrintLayout();

    try {
        window.print();
    } catch (error) {
        cleanup();
        throw error;
    }
}
