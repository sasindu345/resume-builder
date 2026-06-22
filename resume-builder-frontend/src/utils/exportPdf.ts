import type { RefObject } from 'react';

const PRINT_ROOT_ATTR = 'data-pdf-print-root';
const PRINT_TARGET_ATTR = 'data-pdf-print-target';
const PRINT_STYLE_ID = 'pdf-export-print-styles';
const A4_WIDTH_MM = '210mm';
const A4_HEIGHT_MM = '297mm';

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
        background: #ffffff !important;
        overflow: visible !important;
    }

    body * {
        visibility: hidden !important;
    }

    [${PRINT_ROOT_ATTR}],
    [${PRINT_ROOT_ATTR}] * {
        visibility: visible !important;
    }

    [${PRINT_ROOT_ATTR}] {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: ${A4_WIDTH_MM} !important;
        min-height: ${A4_HEIGHT_MM} !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 1 !important;
        overflow: visible !important;
        pointer-events: none !important;
        background: #ffffff !important;
        z-index: 2147483647 !important;
    }

    [${PRINT_TARGET_ATTR}] {
        position: static !important;
        width: ${A4_WIDTH_MM} !important;
        min-height: ${A4_HEIGHT_MM} !important;
        max-width: none !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        background: #ffffff !important;
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

function removeExistingPrintArtifacts(): void {
    document.getElementById(PRINT_STYLE_ID)?.remove();
    document.querySelectorAll(`[${PRINT_ROOT_ATTR}]`).forEach((node) => node.remove());
}

function createPrintRoot(clonedPreview: HTMLElement): HTMLDivElement {
    const root = document.createElement('div');
    root.setAttribute(PRINT_ROOT_ATTR, 'true');
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.opacity = '0';
    root.style.pointerEvents = 'none';
    root.style.overflow = 'hidden';
    root.style.zIndex = '-1';

    clonedPreview.setAttribute(PRINT_TARGET_ATTR, 'true');
    clonedPreview.style.width = '794px';
    clonedPreview.style.minHeight = '1123px';
    clonedPreview.style.maxWidth = 'none';
    clonedPreview.style.transform = 'none';
    clonedPreview.style.margin = '0';
    clonedPreview.style.boxShadow = 'none';
    clonedPreview.style.border = 'none';
    clonedPreview.style.borderRadius = '0';
    clonedPreview.style.overflow = 'visible';
    clonedPreview.style.background = '#ffffff';

    root.appendChild(clonedPreview);
    return root;
}

async function waitForPrintLayout(container: HTMLElement): Promise<void> {
    if (document.fonts) {
        await document.fonts.ready;
    }

    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(images.map((image) => new Promise<void>((resolve) => {
        if (image.complete) {
            resolve();
            return;
        }

        const done = () => resolve();
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
        window.setTimeout(done, 5000);
    })));

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

    removeExistingPrintArtifacts();

    const safeTitle = sanitizeFileName(fileName);

    // Detect mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileDevice) {
        const clonedPreview = previewEl.cloneNode(true) as HTMLElement;
        
        // Temporarily mount the element off-screen for canvas rendering
        clonedPreview.style.position = 'fixed';
        clonedPreview.style.left = '-9999px';
        clonedPreview.style.top = '0';
        clonedPreview.style.width = '794px'; // ~A4 width in px at 96 DPI
        clonedPreview.style.minHeight = '1123px'; // ~A4 height in px at 96 DPI
        clonedPreview.style.maxWidth = 'none';
        clonedPreview.style.transform = 'none';
        clonedPreview.style.background = '#ffffff';
        clonedPreview.style.color = '#000000';
        clonedPreview.style.boxShadow = 'none';
        clonedPreview.style.border = 'none';
        clonedPreview.style.borderRadius = '0';
        clonedPreview.style.overflow = 'visible';
        clonedPreview.style.boxSizing = 'border-box';
        
        document.body.appendChild(clonedPreview);
        
        await waitForPrintLayout(clonedPreview);
        
        try {
            // Lazy load dependencies to optimize initial page loading
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            
            const canvas = await html2canvas(clonedPreview, {
                scale: 2, // High resolution crisp text/images
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`${safeTitle}.pdf`);
        } finally {
            clonedPreview.remove();
        }
        return;
    }

    // Desktop/standard window.print() path
    const previousTitle = document.title;
    const styleEl = document.createElement('style');
    const clonedPreview = previewEl.cloneNode(true) as HTMLElement;
    const printRoot = createPrintRoot(clonedPreview);

    styleEl.id = PRINT_STYLE_ID;
    styleEl.textContent = PRINT_CSS;

    document.title = safeTitle;
    document.head.appendChild(styleEl);
    document.body.appendChild(printRoot);

    let cleanedUp = false;
    const mediaQueryList = typeof window.matchMedia === 'function'
        ? window.matchMedia('print')
        : null;
    let fallbackCleanupId: number | undefined;

    const cleanup = () => {
        if (cleanedUp) {
            return;
        }

        cleanedUp = true;
        document.title = previousTitle;
        printRoot.remove();
        styleEl.remove();

        if (fallbackCleanupId) {
            window.clearTimeout(fallbackCleanupId);
        }

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

    fallbackCleanupId = window.setTimeout(() => {
        cleanup();
    }, 60_000);

    await waitForPrintLayout(printRoot);

    try {
        window.print();
    } catch (error) {
        cleanup();
        throw error;
    }
}
