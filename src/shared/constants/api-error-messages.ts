/**
 * Map mã lỗi (error.code) từ backend sang thông báo tiếng Việt cho UI.
 * Nguồn code: ecometric-be/src/shared/errors/error-codes.ts (enum ErrorCode).
 * KHÔNG hiển thị message tiếng Anh gốc từ BE; luôn tra theo code tại đây.
 */
export const API_ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: "Yêu cầu không hợp lệ.",
  AUTHENTICATION_FAILED: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
  TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  INVALID_REFRESH_TOKEN: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
  UNAUTHORIZED: "Bạn cần đăng nhập để tiếp tục.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",

  BUSINESS_NOT_FOUND: "Không tìm thấy doanh nghiệp.",
  BUSINESS_CONTEXT_REQUIRED: "Vui lòng chọn doanh nghiệp để tiếp tục.",
  BUSINESS_ACCESS_DENIED: "Bạn không có quyền truy cập doanh nghiệp này.",
  BUSINESS_SLUG_ALREADY_EXISTS: "Đường dẫn doanh nghiệp đã tồn tại.",
  BUSINESS_TAX_CODE_ALREADY_EXISTS: "Mã số thuế đã được sử dụng.",
  BUSINESS_ALREADY_DELETED: "Doanh nghiệp này đã bị xoá.",

  BRANCH_NOT_FOUND: "Không tìm thấy chi nhánh.",
  BRANCH_NAME_ALREADY_EXISTS: "Tên chi nhánh đã tồn tại.",
  BRANCH_CODE_ALREADY_EXISTS: "Mã chi nhánh đã tồn tại.",
  BRANCH_ALREADY_DELETED: "Chi nhánh này đã bị xoá.",

  MEMBER_NOT_FOUND: "Không tìm thấy thành viên.",
  MEMBER_ALREADY_EXISTS: "Thành viên đã tồn tại trong doanh nghiệp.",
  MEMBER_NOT_ACTIVE: "Thành viên chưa được kích hoạt.",

  INVITATION_NOT_FOUND: "Không tìm thấy lời mời.",
  INVITATION_ALREADY_EXISTS: "Lời mời đã tồn tại.",
  INVITATION_EXPIRED: "Lời mời đã hết hạn.",
  INVITATION_ALREADY_ACCEPTED: "Lời mời đã được chấp nhận trước đó.",
  INVITATION_REVOKED: "Lời mời đã bị thu hồi.",
  INVITATION_ALREADY_USED: "Lời mời đã được sử dụng.",
  INVALID_INVITATION_TOKEN: "Mã lời mời không hợp lệ.",
  AUTHENTICATION_REQUIRED_FOR_EXISTING_USER:
    "Tài khoản đã tồn tại. Vui lòng đăng nhập để chấp nhận lời mời.",
  CANNOT_INVITE_SYSTEM_ADMIN: "Không thể mời quản trị viên hệ thống.",
  CANNOT_ASSIGN_SYSTEM_ADMIN_TO_BUSINESS:
    "Không thể gán quản trị viên hệ thống vào doanh nghiệp.",
  CANNOT_REMOVE_LAST_COMPANY_ADMIN:
    "Không thể xoá quản trị viên doanh nghiệp cuối cùng.",
  CANNOT_CHANGE_LAST_COMPANY_ADMIN_ROLE:
    "Không thể đổi vai trò của quản trị viên doanh nghiệp cuối cùng.",

  USER_NOT_FOUND: "Không tìm thấy người dùng.",
  EMAIL_ALREADY_EXISTS: "Email này đã được đăng ký.",
  NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu.",
  CONFLICT: "Dữ liệu bị xung đột. Vui lòng thử lại.",
  VALIDATION_ERROR: "Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại.",
  INTERNAL_SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  EXTERNAL_SERVICE_ERROR:
    "Dịch vụ bên ngoài đang gặp sự cố. Vui lòng thử lại sau.",
};

/** Thông báo mặc định khi không xác định được mã lỗi cụ thể. */
export const DEFAULT_API_ERROR_MESSAGE = "Đã có lỗi xảy ra. Vui lòng thử lại.";

/** Thông báo khi không kết nối được tới máy chủ (lỗi mạng/CORS). */
export const NETWORK_ERROR_MESSAGE =
  "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
