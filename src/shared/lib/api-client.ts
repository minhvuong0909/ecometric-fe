import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/shared/lib/auth-storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

/** Phát ra khi phiên hết hạn và không thể refresh (để UI/store tự đăng xuất). */
export const AUTH_EXPIRED_EVENT = "ecometric:auth-expired";

/** Chuẩn hoá lỗi trả về từ backend: { error: { code, message, details } } */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type BackendSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

type BackendError = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Có gắn Authorization header hay không (mặc định true) */
  auth?: boolean;
  /** Có thử refresh token khi gặp 401 hay không (mặc định true) */
  retryOnUnauthorized?: boolean;
  /** Header bổ sung (vd: X-Business-Id) */
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

let refreshPromise: Promise<boolean> | null = null;

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildHeaders(
  auth: boolean,
  hasBody: boolean,
  isFormData: boolean,
  extra?: Record<string, string>,
): Headers {
  const headers = new Headers();
  if (hasBody && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      headers.set(key, value);
    }
  }
  if (!headers.has("X-Business-Id") && typeof window !== "undefined") {
    const activeBusinessId = localStorage.getItem("ecometric.activeBusinessId");
    if (activeBusinessId) {
      headers.set("X-Business-Id", activeBusinessId);
    }
  }
  return headers;
}

/** Gọi /auth/refresh 1 lần, dùng chung promise để tránh refresh song song */
async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearSession();
          return false;
        }

        const payload = (await parseResponse(response)) as
          | BackendSuccess<{ accessToken: string; refreshToken: string }>
          | null;

        if (!payload?.data?.accessToken || !payload.data.refreshToken) {
          clearSession();
          return false;
        }

        setTokens(payload.data.accessToken, payload.data.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function rawRequest<T>(
  path: string,
  options: RequestOptions,
): Promise<T> {
  const { method = "GET", body, auth = true, headers, signal } = options;
  const hasBody = body !== undefined && body !== null;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth, hasBody, isFormData, headers),
    body: hasBody ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
    signal,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const errorBody = payload as BackendError | null;
    throw new ApiError(
      errorBody?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorBody?.error?.code,
      errorBody?.error?.details,
    );
  }

  return (payload as BackendSuccess<T>).data;
}

/** Request chính: tự động refresh + retry đúng 1 lần khi gặp 401 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, retryOnUnauthorized = true } = options;

  try {
    return await rawRequest<T>(path, options);
  } catch (error) {
    const shouldRetry =
      error instanceof ApiError &&
      error.status === 401 &&
      auth &&
      retryOnUnauthorized;

    if (!shouldRetry) throw error;

    const refreshed = await tryRefreshTokens();
    if (!refreshed) {
      clearSession();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
      throw error;
    }

    return rawRequest<T>(path, { ...options, retryOnUnauthorized: false });
  }
}

/** Hỗ trợ tải file nhị phân (PDF, XLSX) kèm tên file từ Content-Disposition */
export async function downloadFile(
  path: string,
  options: RequestOptions = {},
): Promise<{ blob: Blob; fileName: string }> {
  const { auth = true, headers, signal } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(auth, false, false, headers),
    signal,
  });

  if (!response.ok) {
    const payload = await parseResponse(response);
    const errorBody = payload as BackendError | null;
    throw new ApiError(
      errorBody?.error?.message ?? `Download failed with status ${response.status}`,
      response.status,
      errorBody?.error?.code,
      errorBody?.error?.details,
    );
  }

  const contentDisposition = response.headers.get("content-disposition");
  let fileName = "download";
  if (contentDisposition) {
    const match = /filename=["']?([^"']+)["']?/.exec(contentDisposition);
    if (match?.[1]) fileName = match[1];
  }

  const blob = await response.blob();
  return { blob, fileName };
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
  download: (path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    downloadFile(path, options),
};

