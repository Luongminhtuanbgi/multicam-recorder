/**
 * Danh sách các đường dẫn endpoint tương đối sau tiền tố `/api`.
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',

  // Xác thực & Tài khoản
  SIGNUP: '/signup',
  GET_VERIFY_CODE: '/get_verify_code',
  CHECK_VERIFY_CODE: '/check_verify_code',
  LOGIN: '/login',
  REFRESH_TOKEN: '/refresh_token',
  LOGOUT: '/logout',
  CHANGE_PASSWORD: '/change_password',
  RESET_PASSWORD: '/reset_password',
  DELETE_ACCOUNT: '/delete_account',

  // Phòng & Thiết bị
  CREATE_ROOM: '/create_room',
  JOIN_ROOM: '/join_room',
  GET_ROOM_MEMBERS: '/get_room_members',
  LEAVE_ROOM: '/leave_room',
  KICK_MEMBER: '/kick_member',
  CLOSE_ROOM: '/close_room',

  // Đồng bộ & Điều khiển quay
  SYNC_DEVICE: '/sync_device',
  SYNC_ROOM: '/sync_room',
  START_RECORDING: '/start_recording',
  STOP_RECORDING: '/stop_recording',

  // Tải video lên theo phần
  INIT_UPLOAD: '/init_upload',
  UPLOAD_CHUNK: '/upload_chunk',
  GET_UPLOAD_STATUS: '/get_upload_status',
  COMPLETE_UPLOAD: '/complete_upload',

  // Thư viện video
  GET_LIST_VIDEOS: '/get_list_videos',
  GET_VIDEO: '/get_video',
  GET_DOWNLOAD_URL: '/get_download_url',
  DELETE_VIDEO: '/delete_video',
  DELETE_VIDEOS_BULK: '/delete_videos_bulk',
} as const;
