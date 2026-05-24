const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/$/, '')
  : '';

interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export async function apiRequest<T>(
  path: string,
  { timeoutMs = 10000, headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof data === 'object' && data !== null && 'error' in data
          ? String(data.error)
          : 'Something went wrong. Please try again.';
      throw new ApiError(message, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Unable to reach the server. Please try again later.', 0);
  } finally {
    window.clearTimeout(timeout);
  }
}

export const getAdminToken = () => window.localStorage.getItem('vinayakart_admin_token');

export const setAdminToken = (token: string) => {
  window.localStorage.setItem('vinayakart_admin_token', token);
};

export const clearAdminToken = () => {
  window.localStorage.removeItem('vinayakart_admin_token');
};

export function adminRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const token = getAdminToken();

  return apiRequest<T>(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export const getUserToken = () => window.localStorage.getItem('vinayakart_user_token');

export const setUserToken = (token: string) => {
  window.localStorage.setItem('vinayakart_user_token', token);
};

export const clearUserToken = () => {
  window.localStorage.removeItem('vinayakart_user_token');
};

export function userRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const token = getUserToken();

  return apiRequest<T>(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
