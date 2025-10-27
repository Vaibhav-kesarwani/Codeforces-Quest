// src/utils/apiErrorHandler.ts

export interface ApiError {
  message: string;
  code: ApiErrorCode;
  status?: number;
  details?: unknown;
}

export type ApiErrorCode = 
  | 'NETWORK_ERROR' 
  | 'TIMEOUT' 
  | 'HTTP_ERROR' 
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'UNKNOWN_ERROR'
  | 'ABORT_ERROR';

export class NetworkError extends Error {
  code: ApiErrorCode;
  status?: number;

  constructor(message: string, code: ApiErrorCode, status?: number) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Safe fetch wrapper with timeout and error handling
 */
export async function safeFetch<T = unknown>(
  url: string,
  options?: RequestInit,
  timeout = 30000
): Promise<{ data?: T; error?: ApiError }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for rate limit
    if (response.status === 429) {
      return {
        error: {
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT',
          status: 429,
        },
      };
    }

    // Check for other HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorBody = await response.json();
        if (errorBody?.error) {
          errorMessage = typeof errorBody.error === 'string' 
            ? errorBody.error 
            : errorBody.error.message || errorMessage;
        }
      } catch {
        // If JSON parsing fails, use default error message
      }

      throw new NetworkError(errorMessage, 'HTTP_ERROR', response.status);
    }

    const data = await response.json();
    return { data };

  } catch (err) {
    clearTimeout(timeoutId);

    // Handle abort errors
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        error: {
          message: 'Request timeout. The server is taking too long to respond.',
          code: 'TIMEOUT',
        },
      };
    }

    // Handle network errors (offline, DNS failure, etc.)
    // TypeErrors from fetch API usually indicate network problems
    if (err instanceof TypeError) {
      const errorMsg = err.message.toLowerCase();
      // Check for common network error indicators
      if (errorMsg.includes('fetch') || 
          errorMsg.includes('network') || 
          errorMsg.includes('failed') ||
          errorMsg.includes('internet')) {
        return {
          error: {
            message: 'Network error. Please check your internet connection.',
            code: 'NETWORK_ERROR',
          },
        };
      }
    }

    // Handle our custom NetworkError
    if (err instanceof NetworkError) {
      return {
        error: {
          message: err.message,
          code: err.code,
          status: err.status,
        },
      };
    }

    // Handle unknown errors
    return {
      error: {
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR',
        details: err,
      },
    };
  }
}

/**
 * Retry logic for failed requests
 */
export async function fetchWithRetry<T = unknown>(
  url: string,
  options?: RequestInit,
  maxRetries = 2,
  timeout = 30000
): Promise<{ data?: T; error?: ApiError }> {
  let lastError: ApiError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const { data, error } = await safeFetch<T>(url, options, timeout);

    if (data) {
      return { data };
    }

    lastError = error;

    // Don't retry on these errors
    if (error?.code === 'RATE_LIMIT' || error?.code === 'HTTP_ERROR') {
      break;
    }

    // Retry with exponential backoff
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  return { error: lastError };
}

/**
 * Get user-friendly error messages
 */
export function getErrorMessage(error: ApiError): string {
  const errorMessages: Record<ApiErrorCode, string | ((error: ApiError) => string)> = {
    NETWORK_ERROR: '🌐 No internet connection. Please check your network and try again.',
    TIMEOUT: '⏱️ Request timed out. The server is taking too long to respond.',
    HTTP_ERROR: (err) => {
      if (err.status === 404) return '❌ Resource not found.';
      if (err.status === 429) return '⚠️ Too many requests. Please wait a moment.';
      if (err.status === 500) return '🔧 Server error. Please try again later.';
      if (err.status === 503) return '🔧 Service unavailable. Please try again later.';
      return `⚠️ Server error (${err.status}). Please try again.`;
    },
    RATE_LIMIT: '⚠️ Rate limit exceeded. Please wait or upgrade your API plan.',
    API_ERROR: '❌ API error occurred. Please try again.',
    ABORT_ERROR: '🛑 Request was cancelled.',
    UNKNOWN_ERROR: '❌ Something went wrong. Please try again.',
  };

  const messageOrFn = errorMessages[error.code];
  
  if (typeof messageOrFn === 'function') {
    return messageOrFn(error);
  }
  
  return messageOrFn || error.message || 'An error occurred';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
}