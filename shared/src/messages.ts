import { ERROR_REASONS, RESPONSE_CODES } from './responseCodes';

/**
 * Danh sách thông báo tiếng Việt dùng thống nhất trên toàn ứng dụng.
 */
export const MESSAGES = {
  // 4.1. Validate phía client (dùng chung mọi màn hình)
  PHONE_REQUIRED: 'Vui lòng nhập số điện thoại',
  PHONE_INVALID: 'Số điện thoại không đúng định dạng',
  EMAIL_REQUIRED: 'Vui lòng nhập email',
  EMAIL_INVALID: 'Email không đúng định dạng',
  LOGIN_ID_REQUIRED: 'Vui lòng nhập email hoặc số điện thoại',
  LOGIN_ID_INVALID: 'Email hoặc số điện thoại không đúng định dạng',
  NAME_REQUIRED: 'Vui lòng nhập họ và tên',
  NAME_TOO_LONG: 'Họ và tên không được quá 50 ký tự',
  PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu',
  PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 20 ký tự',
  PASSWORD_CHARSET: 'Mật khẩu không được chứa ký tự đặc biệt',
  PASSWORD_EQUALS_PHONE: 'Mật khẩu không được trùng với số điện thoại',
  PASSWORD_CONFIRM_MISMATCH: 'Mật khẩu xác nhận không khớp',
  NEW_PASSWORD_SAME: 'Mật khẩu mới phải khác mật khẩu cũ',
  VERIFY_CODE_FORMAT: 'Mã xác thực gồm 6 chữ số',
  INVITE_CODE_FORMAT: 'Mã phòng gồm 6 ký tự chữ hoặc số',
  CAMERA_NAME_REQUIRED: 'Vui lòng nhập tên camera',
  GRANT_REQUIRED: 'Bạn cần đồng ý cấp quyền điều khiển quay để vào phòng',
  SERVER_ADDRESS_INVALID: 'Địa chỉ máy chủ không hợp lệ (ví dụ: 192.168.1.10:3000)',

  // 4.2. Kết nối
  NETWORK_OFFLINE: 'Không có kết nối mạng. Vui lòng kiểm tra Wi-Fi',
  CONNECTION_ERROR: 'Không thể kết nối Internet. Vui lòng thử lại',
  SERVER_UNREACHABLE: 'Không thể kết nối tới máy chủ. Kiểm tra địa chỉ máy chủ và mạng Wi-Fi',
  INVALID_RESPONSE: 'Dữ liệu trả về không hợp lệ. Không thể kết nối Internet',
  GENERIC_ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại',

  // 4.3. Nghiệp vụ
  ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại',
  WRONG_PASSWORD: 'Sai mật khẩu',
  ACCOUNT_LOCKED: 'Tài khoản đã bị khóa',
  EMAIL_OR_PHONE_EXISTED: 'Email/số điện thoại đã được đăng ký',
  VERIFY_CODE_INCORRECT: 'Mã xác thực không đúng',
  VERIFY_CODE_TOO_SOON: 'Vui lòng đợi hết thời gian đếm ngược để gửi lại mã',
  WRONG_OLD_PASSWORD: 'Mật khẩu cũ không đúng',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
  PASSWORD_RESET_SUCCESS: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập',
  SESSION_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
  NO_PERMISSION: 'Tài khoản của bạn không có quyền thực hiện thao tác này',
  CONTROLLER_CANNOT_DELETE: 'Tài khoản Controller không thể xóa',
  INVITE_CODE_INVALID_OR_EXPIRED: 'Mã mời không đúng hoặc đã hết hạn. Hãy xin mã mới từ Controller',
  ROOM_FULL: 'Phòng đã đầy',
  DEVICE_IN_OTHER_ROOM: 'Thiết bị đang ở trong một phòng khác. Bạn có muốn rời phòng cũ không?',
  ROOM_CLOSED: 'Phòng đã đóng. Thiết bị trở về chế độ quay độc lập',
  MEMBER_NOT_IN_ROOM: 'Thiết bị này không còn ở trong phòng',
  NO_ONLINE_DEVICE: 'Không có máy Remote nào đang trực tuyến',
  REMOTE_CONTROLLED: 'Đang được điều khiển từ xa',
  FILE_TOO_BIG: 'Video vượt quá 1 GB',
  FILE_NOT_MP4: 'Chỉ hỗ trợ video định dạng MP4',
  UPLOAD_FAILED: 'Tải video lên thất bại. Hệ thống sẽ thử lại khi mở ứng dụng',
  STORAGE_FULL: 'Đã hết dung lượng lưu trữ. Đề nghị Controller xóa bớt clip cũ',
  LOW_STORAGE_WARNING: 'Bộ nhớ còn dưới 500 MB. Vui lòng giải phóng dung lượng trước khi quay',
  VIDEO_NOT_FOUND: 'Video không tồn tại hoặc đã bị xóa',
  EMPTY_VIDEOS: 'Chưa có video nào',
  TOO_MANY_VIDEOS: 'Chỉ được chọn tối đa 50 clip mỗi lần xóa',
  DOWNLOAD_PROGRESS: 'Đang tải clip {current}/{total}',
  CAMERA_PERMISSION_DENIED: 'Ứng dụng cần quyền Camera và Micro để quay video',

  // 4.4. Hộp xác nhận
  CONFIRM_KICK:
    'Loại "{camera_name}" khỏi phòng? Nếu máy đang quay, clip sẽ được lưu và tải lên trước khi rời phòng',
  CONFIRM_CLOSE_ROOM:
    'Đóng phòng? Mã mời sẽ bị vô hiệu. Nếu đang quay, các máy sẽ dừng và tải video lên trước khi phòng đóng',
  CONFIRM_LEAVE_ROOM: 'Rời phòng và thu hồi quyền điều khiển của Controller?',
  CONFIRM_DELETE_VIDEO: 'Xóa clip này khỏi máy chủ? Bản trên máy Remote vẫn được giữ nguyên',
  CONFIRM_DELETE_VIDEOS: 'Xóa {count} clip khỏi máy chủ?',
  CONFIRM_DELETE_ACCOUNT_1:
    'Xóa tài khoản sẽ xóa vĩnh viễn toàn bộ video bạn đã tải lên. Nhập mật khẩu để tiếp tục',
  CONFIRM_DELETE_ACCOUNT_2: 'Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa tài khoản?',
  CONFIRM_LOGOUT: 'Đăng xuất khỏi thiết bị này?',
} as const;

export type MessageKey = keyof typeof MESSAGES;

/**
 * Lấy câu thông báo tiếng Việt theo key và điền tham số động (vd `{current}`, `{total}`, `{camera_name}`, `{count}`).
 */
export function formatMessage(key: MessageKey, params?: Record<string, string | number>): string {
  const template: string = MESSAGES[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, token: string) => {
    const val = params[token];
    return val !== undefined ? String(val) : match;
  });
}

const REASON_TO_MESSAGE_KEY: Record<string, MessageKey> = {
  [ERROR_REASONS.WRONG_PASSWORD]: 'WRONG_PASSWORD',
  [ERROR_REASONS.WRONG_OLD_PASSWORD]: 'WRONG_OLD_PASSWORD',
  [ERROR_REASONS.SAME_AS_OLD_PASSWORD]: 'NEW_PASSWORD_SAME',
  [ERROR_REASONS.PASSWORD_EQUALS_PHONE]: 'PASSWORD_EQUALS_PHONE',
  [ERROR_REASONS.ACCOUNT_LOCKED]: 'ACCOUNT_LOCKED',
  [ERROR_REASONS.GRANT_CONTROL_REQUIRED]: 'GRANT_REQUIRED',
  [ERROR_REASONS.NO_ONLINE_DEVICE]: 'NO_ONLINE_DEVICE',
  [ERROR_REASONS.MIME_NOT_MP4]: 'FILE_NOT_MP4',
  [ERROR_REASONS.TOO_MANY_VIDEOS]: 'TOO_MANY_VIDEOS',
  [ERROR_REASONS.MEMBER_NOT_IN_ROOM]: 'MEMBER_NOT_IN_ROOM',
  [ERROR_REASONS.CONFIRM_REQUIRED]: 'GENERIC_ERROR',
  [ERROR_REASONS.CONTROLLER_UNDELETABLE]: 'CONTROLLER_CANNOT_DELETE',
  [ERROR_REASONS.DEVICE_MISMATCH]: 'NO_PERMISSION',
  [ERROR_REASONS.NOT_FOUND]: 'ACCOUNT_NOT_FOUND',
};

/**
 * Ánh xạ cặp `(code, reason)` từ API sang `MessageKey` tiếng Việt.
 * Trả về `null` với các mã được phía client tự xử lý ngầm hoặc chuyển hướng riêng.
 */
export function resolveApiErrorMessageKey(code: string, reason?: string | null): MessageKey | null {
  if (code === RESPONSE_CODES.USER_NOT_VALIDATED && reason === ERROR_REASONS.NOT_ACTIVATED) {
    return null;
  }
  if (reason && REASON_TO_MESSAGE_KEY[reason]) {
    return REASON_TO_MESSAGE_KEY[reason];
  }

  switch (code) {
    case RESPONSE_CODES.OK:
    case RESPONSE_CODES.ACTION_ALREADY_DONE:
    case RESPONSE_CODES.INVALID_SESSION_STATE:
    case RESPONSE_CODES.UPLOAD_SESSION_NOT_FOUND:
    case RESPONSE_CODES.MISSING_CHUNKS:
    case RESPONSE_CODES.CHECKSUM_MISMATCH:
    case RESPONSE_CODES.VIDEO_ALREADY_UPLOADED:
    case RESPONSE_CODES.ANOTHER_DOWNLOAD_IN_PROGRESS:
      return null;
    case RESPONSE_CODES.DB_CONNECTION_ERROR:
    case RESPONSE_CODES.UNKNOWN_ERROR:
    case RESPONSE_CODES.EXCEPTION_ERROR:
      return 'CONNECTION_ERROR';
    case RESPONSE_CODES.PARAM_NOT_ENOUGH:
    case RESPONSE_CODES.PARAM_TYPE_INVALID:
    case RESPONSE_CODES.PARAM_VALUE_INVALID:
    case RESPONSE_CODES.NOT_ROOM_OWNER:
    case RESPONSE_CODES.METHOD_INVALID:
      return 'GENERIC_ERROR';
    case RESPONSE_CODES.FILE_TOO_BIG:
      return 'FILE_TOO_BIG';
    case RESPONSE_CODES.UPLOAD_FILE_FAILED:
      return 'UPLOAD_FAILED';
    case RESPONSE_CODES.NOT_ACCESS:
      return 'NO_PERMISSION';
    case RESPONSE_CODES.LIMITED_ACCESS:
      return 'VERIFY_CODE_TOO_SOON';
    case RESPONSE_CODES.INVITE_CODE_INVALID:
      return 'INVITE_CODE_INVALID_OR_EXPIRED';
    case RESPONSE_CODES.ROOM_FULL:
      return 'ROOM_FULL';
    case RESPONSE_CODES.DEVICE_IN_OTHER_ROOM:
      return 'DEVICE_IN_OTHER_ROOM';
    case RESPONSE_CODES.ROOM_CLOSED:
      return 'ROOM_CLOSED';
    case RESPONSE_CODES.STORAGE_QUOTA_EXCEEDED:
      return 'STORAGE_FULL';
    case RESPONSE_CODES.VIDEO_NOT_FOUND:
      return 'VIDEO_NOT_FOUND';
    case RESPONSE_CODES.VERIFY_CODE_INCORRECT:
      return 'VERIFY_CODE_INCORRECT';
    case RESPONSE_CODES.NO_DATA:
      return 'EMPTY_VIDEOS';
    case RESPONSE_CODES.USER_NOT_VALIDATED:
      return 'ACCOUNT_NOT_FOUND';
    case RESPONSE_CODES.USER_EXISTED:
      return 'EMAIL_OR_PHONE_EXISTED';
    case RESPONSE_CODES.TOKEN_INVALID:
      return 'SESSION_EXPIRED';
    default:
      return 'GENERIC_ERROR';
  }
}
