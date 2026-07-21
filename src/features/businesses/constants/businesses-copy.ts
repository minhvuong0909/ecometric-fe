import type { UserRole } from "@/features/auth/types/auth.types";
import type {
  BusinessStatus,
  InvitationStatus,
  ManageableMemberStatus,
  ManageableRole,
  MemberStatus,
} from "@/features/businesses/types/businesses.types";

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  ACTIVE: "Đang hoạt động",
  SUSPENDED: "Tạm ngưng",
  ARCHIVED: "Lưu trữ",
};

export const BUSINESS_STATUS_OPTIONS: { value: BusinessStatus; label: string }[] =
  [
    { value: "ACTIVE", label: BUSINESS_STATUS_LABELS.ACTIVE },
    { value: "SUSPENDED", label: BUSINESS_STATUS_LABELS.SUSPENDED },
    { value: "ARCHIVED", label: BUSINESS_STATUS_LABELS.ARCHIVED },
  ];

export const BUSINESSES_COPY = {
  nav: "Doanh nghiệp",
  list: {
    breadcrumbs: [{ label: "Doanh nghiệp", active: true }],
    title: "Doanh nghiệp",
    description:
      "Quản lý danh sách doanh nghiệp bạn tham gia, tìm kiếm và lọc theo trạng thái.",
    createCta: "Thêm doanh nghiệp",
    searchPlaceholder: "Tìm theo tên hoặc mã…",
    filterAll: "Tất cả trạng thái",
    loading: "Đang tải danh sách…",
    error: "Không tải được danh sách doanh nghiệp. Vui lòng thử lại.",
    empty: "Chưa có doanh nghiệp nào.",
    emptyFiltered: "Không tìm thấy doanh nghiệp phù hợp.",
    columns: {
      name: "Doanh nghiệp",
      taxCode: "Mã số thuế",
      industry: "Ngành",
      status: "Trạng thái",
      actions: "Thao tác",
    },
    view: "Xem",
    edit: "Sửa",
    delete: "Xoá",
    pagination: {
      summary: (from: number, to: number, total: number) =>
        `${from}–${to} trên ${total}`,
      prev: "Trước",
      next: "Sau",
      page: (page: number, total: number) => `Trang ${page}/${total}`,
    },
    noValue: "—",
  },
  detail: {
    breadcrumbs: [{ label: "Doanh nghiệp" }, { label: "Chi tiết", active: true }],
    back: "Quay lại danh sách",
    edit: "Chỉnh sửa",
    delete: "Xoá doanh nghiệp",
    loading: "Đang tải doanh nghiệp…",
    error: "Không tải được thông tin doanh nghiệp.",
    infoTitle: "Thông tin chung",
    metaTitle: "Thông tin hệ thống",
    fields: {
      name: "Tên doanh nghiệp",
      slug: "Đường dẫn (slug)",
      taxCode: "Mã số thuế",
      industry: "Ngành nghề",
      country: "Quốc gia",
      timezone: "Múi giờ",
      website: "Website",
      status: "Trạng thái",
      createdAt: "Ngày tạo",
      updatedAt: "Cập nhật lần cuối",
    },
    deleteConfirm: (name: string) =>
      `Xoá doanh nghiệp "${name}"? Hành động này không thể hoàn tác.`,
  },
  form: {
    createBreadcrumbs: [
      { label: "Doanh nghiệp" },
      { label: "Thêm mới", active: true },
    ],
    editBreadcrumbs: [
      { label: "Doanh nghiệp" },
      { label: "Chỉnh sửa", active: true },
    ],
    createTitle: "Thêm doanh nghiệp",
    createDescription:
      "Tạo doanh nghiệp mới và gửi lời mời cho quản trị viên doanh nghiệp.",
    editTitle: "Chỉnh sửa doanh nghiệp",
    editDescription: "Cập nhật thông tin doanh nghiệp.",
    sectionGeneral: "Thông tin doanh nghiệp",
    sectionAdmin: "Quản trị viên doanh nghiệp",
    sectionBranch: "Chi nhánh mặc định (tuỳ chọn)",
    labels: {
      name: "Tên doanh nghiệp",
      slug: "Đường dẫn (slug)",
      taxCode: "Mã số thuế",
      industry: "Ngành nghề",
      country: "Quốc gia (mã 2 ký tự)",
      timezone: "Múi giờ",
      website: "Website",
      status: "Trạng thái",
      companyAdminEmail: "Email quản trị viên",
      companyAdminFullName: "Họ tên quản trị viên",
      branchName: "Tên chi nhánh",
      branchCode: "Mã chi nhánh",
      branchAddress: "Địa chỉ",
      branchCountry: "Quốc gia chi nhánh",
    },
    placeholders: {
      name: "VD: Công ty TNHH ABC",
      slug: "vd-cong-ty-abc",
      taxCode: "0312345678",
      industry: "Sản xuất, Bán lẻ…",
      country: "VN",
      timezone: "Asia/Ho_Chi_Minh",
      website: "https://congty.vn",
      companyAdminEmail: "admin@congty.vn",
      companyAdminFullName: "Nguyễn Văn A",
      branchName: "Trụ sở chính",
      branchCode: "HQ",
      branchAddress: "Số 1, Đường ABC, Quận 1",
      branchCountry: "VN",
    },
    submitCreate: "Tạo doanh nghiệp",
    submitEdit: "Lưu thay đổi",
    submitting: "Đang lưu…",
    cancel: "Huỷ",
    createSuccess: "Tạo doanh nghiệp thành công.",
    editSuccess: "Cập nhật doanh nghiệp thành công.",
    adminOnly: "Chỉ quản trị viên hệ thống mới có thể tạo doanh nghiệp.",
    loading: "Đang tải doanh nghiệp…",
    notFound: "Không tìm thấy doanh nghiệp.",
  },
  validation: {
    nameRequired: "Vui lòng nhập tên doanh nghiệp.",
    nameMin: "Tên tối thiểu 2 ký tự.",
    slugRequired: "Vui lòng nhập đường dẫn (slug).",
    slugInvalid: "Slug chỉ gồm chữ thường, số và dấu gạch ngang.",
    countryLength: "Mã quốc gia gồm 2 ký tự.",
    emailRequired: "Vui lòng nhập email quản trị viên.",
    emailInvalid: "Email không hợp lệ.",
    websiteInvalid: "Website không hợp lệ.",
  },
} as const;

/* ── Thành viên doanh nghiệp ── */

export const MEMBER_ROLE_LABELS: Record<UserRole, string> = {
  SYSTEM_ADMIN: "Quản trị hệ thống",
  COMPANY_ADMIN: "Quản trị doanh nghiệp",
  BRANCH_MANAGER: "Quản lý chi nhánh",
  STAFF: "Nhân viên",
  VIEWER: "Người xem",
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  INVITED: "Đã mời",
  ACTIVE: "Đang hoạt động",
  DISABLED: "Vô hiệu hoá",
  REMOVED: "Đã gỡ",
};

/** Các vai trò có thể gán cho thành viên (khớp validator BE). */
export const MANAGEABLE_ROLE_OPTIONS: { value: ManageableRole; label: string }[] =
  [
    { value: "COMPANY_ADMIN", label: MEMBER_ROLE_LABELS.COMPANY_ADMIN },
    { value: "BRANCH_MANAGER", label: MEMBER_ROLE_LABELS.BRANCH_MANAGER },
    { value: "STAFF", label: MEMBER_ROLE_LABELS.STAFF },
    { value: "VIEWER", label: MEMBER_ROLE_LABELS.VIEWER },
  ];

/** Các trạng thái có thể đặt cho thành viên (khớp validator BE). */
export const MANAGEABLE_STATUS_OPTIONS: {
  value: ManageableMemberStatus;
  label: string;
}[] = [
  { value: "ACTIVE", label: MEMBER_STATUS_LABELS.ACTIVE },
  { value: "DISABLED", label: MEMBER_STATUS_LABELS.DISABLED },
  { value: "REMOVED", label: MEMBER_STATUS_LABELS.REMOVED },
];

export const MEMBERS_COPY = {
  nav: "Thành viên",
  breadcrumbs: [
    { label: "Doanh nghiệp" },
    { label: "Thành viên", active: true },
  ],
  title: "Thành viên",
  description:
    "Quản lý vai trò và trạng thái của thành viên trong doanh nghiệp.",
  back: "Quay lại doanh nghiệp",
  manageCta: "Quản lý thành viên",
  searchPlaceholder: "Tìm theo tên hoặc email…",
  filterAllRoles: "Tất cả vai trò",
  filterAllStatuses: "Tất cả trạng thái",
  loading: "Đang tải thành viên…",
  error: "Không tải được danh sách thành viên. Vui lòng thử lại.",
  empty: "Chưa có thành viên nào.",
  emptyFiltered: "Không tìm thấy thành viên phù hợp.",
  columns: {
    member: "Thành viên",
    role: "Vai trò",
    status: "Trạng thái",
    joinedAt: "Ngày tham gia",
    actions: "Thao tác",
  },
  remove: "Gỡ",
  removeConfirm: (name: string) =>
    `Gỡ "${name}" khỏi doanh nghiệp? Hành động này không thể hoàn tác.`,
  roleUpdated: "Đã cập nhật vai trò.",
  statusUpdated: "Đã cập nhật trạng thái.",
  removed: "Đã gỡ thành viên.",
  updating: "Đang cập nhật…",
  noName: "Chưa đặt tên",
  noValue: "—",
  pagination: {
    summary: (from: number, to: number, total: number) =>
      `${from}–${to} trên ${total}`,
    prev: "Trước",
    next: "Sau",
    page: (page: number, total: number) => `Trang ${page}/${total}`,
  },
} as const;

/* ── Lời mời doanh nghiệp ── */

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: "Đang chờ",
  ACCEPTED: "Đã chấp nhận",
  EXPIRED: "Hết hạn",
  REVOKED: "Đã thu hồi",
};

export const INVITATION_STATUS_OPTIONS: {
  value: InvitationStatus;
  label: string;
}[] = [
  { value: "PENDING", label: INVITATION_STATUS_LABELS.PENDING },
  { value: "ACCEPTED", label: INVITATION_STATUS_LABELS.ACCEPTED },
  { value: "EXPIRED", label: INVITATION_STATUS_LABELS.EXPIRED },
  { value: "REVOKED", label: INVITATION_STATUS_LABELS.REVOKED },
];

export const INVITATIONS_COPY = {
  nav: "Lời mời",
  breadcrumbs: [
    { label: "Doanh nghiệp" },
    { label: "Lời mời", active: true },
  ],
  title: "Lời mời",
  description: "Mời thành viên mới và quản lý các lời mời đang chờ.",
  back: "Quay lại doanh nghiệp",
  manageCta: "Lời mời",
  inviteTitle: "Mời thành viên",
  inviteDescription: "Gửi email mời tham gia doanh nghiệp với vai trò phù hợp.",
  labels: {
    email: "Email",
    role: "Vai trò",
  },
  placeholders: {
    email: "nguoidung@congty.vn",
  },
  submitInvite: "Gửi lời mời",
  submitting: "Đang gửi…",
  inviteSuccess: "Đã gửi lời mời.",
  searchPlaceholder: "Lọc theo email…",
  filterAll: "Tất cả trạng thái",
  loading: "Đang tải lời mời…",
  error: "Không tải được danh sách lời mời. Vui lòng thử lại.",
  empty: "Chưa có lời mời nào.",
  emptyFiltered: "Không tìm thấy lời mời phù hợp.",
  columns: {
    email: "Email",
    role: "Vai trò",
    status: "Trạng thái",
    expiresAt: "Hết hạn",
    actions: "Thao tác",
  },
  resend: "Gửi lại",
  resent: "Đã gửi lại lời mời.",
  revoke: "Thu hồi",
  revokeConfirm: (email: string) =>
    `Thu hồi lời mời cho "${email}"? Người dùng sẽ không thể dùng liên kết cũ.`,
  revoked: "Đã thu hồi lời mời.",
  noValue: "—",
  pagination: {
    summary: (from: number, to: number, total: number) =>
      `${from}–${to} trên ${total}`,
    prev: "Trước",
    next: "Sau",
    page: (page: number, total: number) => `Trang ${page}/${total}`,
  },
} as const;

export const ACCEPT_INVITATION_COPY = {
  title: "Chấp nhận lời mời",
  description:
    "Hoàn tất tham gia doanh nghiệp. Nếu bạn chưa có tài khoản, hãy đặt họ tên và mật khẩu để tạo tài khoản mới.",
  labels: {
    fullName: "Họ và tên",
    password: "Mật khẩu",
  },
  placeholders: {
    fullName: "Nguyễn Văn A",
    password: "Tối thiểu 8 ký tự",
  },
  hint: "Chỉ cần điền họ tên và mật khẩu nếu bạn là người dùng mới.",
  submit: "Tham gia doanh nghiệp",
  submitting: "Đang xử lý…",
  missingToken: "Liên kết lời mời không hợp lệ hoặc thiếu mã.",
  successTitle: "Tham gia thành công!",
  successBody: (business: string) =>
    `Bạn đã trở thành thành viên của "${business}".`,
  goToApp: "Vào ứng dụng",
  goToLogin: "Đăng nhập",
} as const;
