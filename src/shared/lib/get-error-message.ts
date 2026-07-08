import {
  API_ERROR_MESSAGES,
  DEFAULT_API_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
} from "@/shared/constants/api-error-messages";
import { ApiError } from "@/shared/lib/api-client";

/**
 * Chuyển bất kỳ lỗi nào (ApiError của BE, lỗi mạng, lỗi không xác định)
 * thành thông báo tiếng Việt để hiển thị trên UI.
 * Luôn tra theo error.code của BE, không dùng message tiếng Anh gốc.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code && API_ERROR_MESSAGES[error.code]) {
      return API_ERROR_MESSAGES[error.code];
    }
    return DEFAULT_API_ERROR_MESSAGE;
  }

  if (error instanceof TypeError) {
    return NETWORK_ERROR_MESSAGE;
  }

  return DEFAULT_API_ERROR_MESSAGE;
}
