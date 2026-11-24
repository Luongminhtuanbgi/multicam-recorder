/**
 * Bảng mã phản hồi chuẩn 4 chữ số dùng chung cho toàn bộ hệ thống.
 * Các trường hợp lỗi chi tiết được phân biệt thêm qua trường `data.reason`.
 */
export const RESPONSE_CODES = {
  OK: '1000',
  DB_CONNECTION_ERROR: '1001',
  PARAM_NOT_ENOUGH: '1002',
  PARAM_TYPE_INVALID: '1003',
  PARAM_VALUE_INVALID: '1004',
  UNKNOWN_ERROR: '1005',
  FILE_TOO_BIG: '1006',
  UPLOAD_FILE_FAILED: '1007',
  NOT_ACCESS: '1009',
  ACTION_ALREADY_DONE: '1010',
  LIMITED_ACCESS: '1012',

  INVITE_CODE_INVALID: '2001',
  ROOM_FULL: '2002',
  DEVICE_IN_OTHER_ROOM: '2003',
  NOT_ROOM_OWNER: '2004',
  ROOM_CLOSED: '2005',
  INVALID_SESSION_STATE: '2006',

  UPLOAD_SESSION_NOT_FOUND: '3001',
  MISSING_CHUNKS: '3002',
  CHECKSUM_MISMATCH: '3003',
  STORAGE_QUOTA_EXCEEDED: '3004',
  VIDEO_ALREADY_UPLOADED: '3005',

  VIDEO_NOT_FOUND: '4001',
  ANOTHER_DOWNLOAD_IN_PROGRESS: '4002',

  VERIFY_CODE_INCORRECT: '9993',
  NO_DATA: '9994',
  USER_NOT_VALIDATED: '9995',
  USER_EXISTED: '9996',
  METHOD_INVALID: '9997',
  TOKEN_INVALID: '9998',
  EXCEPTION_ERROR: '9999',
} as const;

export type ResponseCode = (typeof RESPONSE_CODES)[keyof typeof RESPONSE_CODES];

/** Message tiếng Anh chuẩn theo slide đề bài cho từng mã response */
export const RESPONSE_MESSAGES: Record<ResponseCode, string> = {
  '1000': 'OK',
  '1001': 'Can not connect to DB',
  '1002': 'Parameter is not enough',
  '1003': 'Parameter type is invalid',
  '1004': 'Parameter value is invalid',
  '1005': 'Unknown error',
  '1006': 'File size is too big',
  '1007': 'Upload file failed',
  '1009': 'Not access',
  '1010': 'Action has been done previously by this user',
  '1012': 'Limited access',
  '2001': 'Invite code not found or expired',
  '2002': 'Room is full',
  '2003': 'Device already in another room',
  '2004': 'Not room owner',
  '2005': 'Room closed',
  '2006': 'Invalid session state',
  '3001': 'Upload session not found or expired',
  '3002': 'Missing chunks',
  '3003': 'Checksum mismatch',
  '3004': 'Storage quota exceeded',
  '3005': 'Video already uploaded',
  '4001': 'Video not found',
  '4002': 'Another download in progress',
  '9993': 'Code verify is incorrect',
  '9994': 'No data or end of list data',
  '9995': 'User is not validated',
  '9996': 'User existed',
  '9997': 'Method is invalid',
  '9998': 'Token is invalid',
  '9999': 'Exception error',
};

/** HTTP status tương ứng cho từng mã phản hồi */
export const RESPONSE_HTTP_STATUS: Record<ResponseCode, number> = {
  '1000': 200,
  '1001': 500,
  '1002': 400,
  '1003': 400,
  '1004': 400,
  '1005': 500,
  '1006': 413,
  '1007': 500,
  '1009': 403,
  '1010': 200,
  '1012': 429,
  '2001': 404,
  '2002': 409,
  '2003': 409,
  '2004': 403,
  '2005': 409,
  '2006': 409,
  '3001': 404,
  '3002': 422,
  '3003': 422,
  '3004': 507,
  '3005': 409,
  '4001': 404,
  '4002': 409,
  '9993': 400,
  '9994': 200,
  '9995': 404,
  '9996': 409,
  '9997': 405,
  '9998': 401,
  '9999': 500,
};

/** Danh sách mã `data.reason` dùng để phân biệt nguyên nhân lỗi cụ thể */
export const ERROR_REASONS = {
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  WRONG_OLD_PASSWORD: 'WRONG_OLD_PASSWORD',
  SAME_AS_OLD_PASSWORD: 'SAME_AS_OLD_PASSWORD',
  PASSWORD_EQUALS_PHONE: 'PASSWORD_EQUALS_PHONE',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  GRANT_CONTROL_REQUIRED: 'GRANT_CONTROL_REQUIRED',
  NO_ONLINE_DEVICE: 'NO_ONLINE_DEVICE',
  MIME_NOT_MP4: 'MIME_NOT_MP4',
  TOO_MANY_VIDEOS: 'TOO_MANY_VIDEOS',
  MEMBER_NOT_IN_ROOM: 'MEMBER_NOT_IN_ROOM',
  CONFIRM_REQUIRED: 'CONFIRM_REQUIRED',
  CONTROLLER_UNDELETABLE: 'CONTROLLER_UNDELETABLE',
  DEVICE_MISMATCH: 'DEVICE_MISMATCH',
  NOT_FOUND: 'NOT_FOUND',
  NOT_ACTIVATED: 'NOT_ACTIVATED',
} as const;

export type ErrorReason = (typeof ERROR_REASONS)[keyof typeof ERROR_REASONS];

/** Các mã client tự xử lý ngầm (không bật Toast báo lỗi cho người dùng) */
export const AUTO_HANDLED_CODES: ReadonlySet<string> = new Set<ResponseCode>([
  RESPONSE_CODES.ACTION_ALREADY_DONE,
  RESPONSE_CODES.INVALID_SESSION_STATE,
  RESPONSE_CODES.UPLOAD_SESSION_NOT_FOUND,
  RESPONSE_CODES.MISSING_CHUNKS,
  RESPONSE_CODES.CHECKSUM_MISMATCH,
  RESPONSE_CODES.VIDEO_ALREADY_UPLOADED,
  RESPONSE_CODES.ANOTHER_DOWNLOAD_IN_PROGRESS,
]);
