import axios from 'axios'

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as
      | { message?: string; validationErrors?: Record<string, string> }
      | undefined

    if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
      const first = Object.values(data.validationErrors)[0]
      if (first) return formatStatus(status, first)
    }

    if (typeof data?.message === 'string' && data.message.trim() !== '') {
      return formatStatus(status, data.message)
    }

    if (typeof error.message === 'string' && error.message.trim() !== '') {
      return formatStatus(status, error.message)
    }
  }

  if (error instanceof Error && error.message.trim() !== '') {
    return error.message
  }

  return fallback
}

const formatStatus = (status: number | undefined, message: string) => {
  if (!status) return message
  return `HTTP ${status}: ${message}`
}
