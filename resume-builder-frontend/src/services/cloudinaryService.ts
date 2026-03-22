import api from './api'
import { getToken } from '@/utils/tokenStorage'

/**
 * Upload a profile image to Cloudinary via the backend.
 * Requires authentication.
 */
export async function uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const token = getToken()
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

    console.log('[cloudinary-upload] starting', {
        name: file.name,
        size: file.size,
        type: file.type,
        hasToken: Boolean(token),
    })

    const response = await fetch(`${baseUrl}/cloudinary/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
    })

    const rawText = await response.text()

    console.log('[cloudinary-upload] response', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        rawText,
    })

    let data: { url?: string; error?: string; message?: string } = {}
    try {
        data = rawText ? JSON.parse(rawText) : {}
    } catch (error) {
        console.error('[cloudinary-upload] failed to parse JSON response', error)
        throw new Error(`Upload returned invalid JSON: ${rawText || 'empty response'}`)
    }

    if (!response.ok) {
        throw new Error(data.error || data.message || `Upload failed with status ${response.status}`)
    }

    if (!data.url) {
        throw new Error('Upload succeeded but response did not include a URL')
    }

    return data.url
}

/**
 * Get a signed upload signature for direct browser-to-Cloudinary upload.
 * Requires authentication.
 */
export async function getUploadSignature(): Promise<{
    signature: string
    timestamp: number
    api_key: string
    cloud_name: string
}> {
    const response = await api.get('/cloudinary/signature')
    return response.data
}

/**
 * Upload directly to Cloudinary from the browser using an unsigned preset.
 * Does NOT require authentication — available for guest users.
 *
 * Uses the VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET env vars.
 */
export async function uploadImageUnsigned(file: File): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'resume-builder/guest-profiles')

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
}
