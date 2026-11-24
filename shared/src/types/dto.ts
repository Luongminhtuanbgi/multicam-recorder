import type { ErrorReason, ResponseCode } from '../responseCodes';

export type AccountRole = 'controller' | 'remote';

/** 1 = Android, 2 = iOS, 4 = Web (3 dự phòng desktop theo đặc tả) */
export type DeviceType = 1 | 2 | 4;

export type UserStatus = 'pending' | 'active' | 'locked';

export type RoomStatus = 'open' | 'recording' | 'closing' | 'closed';

export type RecordingState = 'idle' | 'accepted' | 'recording' | 'saved' | 'failed';

export type UploadState = 'none' | 'uploading' | 'uploaded' | 'failed';

export type CommandType = 'start_record' | 'stop_record' | 'leave_room';

export type ResolutionOption = '720p' | '1080p';

export type FpsOption = 24 | 30 | 60;

export interface ApiErrorData {
  reason?: ErrorReason | string;
  field?: string;
  [key: string]: unknown;
}

/** Khuôn dạng phản hồi chuẩn cho mọi endpoint REST JSON */
export interface ApiResponse<T = unknown> {
  code: ResponseCode | string;
  message: string;
  data: T;
}

/** Payload của JWT access_token */
export interface JwtClaims {
  /** user_id (`u_...`) */
  sub: string;
  /** account_role */
  acc: AccountRole;
  /** device_id (`dv_...`) */
  did: string;
  /** auth_session_id */
  sid: string;
  iat?: number;
  exp?: number;
}

/** Dữ liệu phản hồi của `GET /api/health` */
export interface HealthResponseDto {
  server_time: string;
  name: string;
  version: string;
}

/**
 * Cấu trúc metadata xuất ra file `session.json` cho mỗi phiên thu thập đa góc quay.
 */
export interface SessionExportDeviceEntry {
  member_id: string;
  device_id: string;
  camera_name: string;
  device_name: string | null;
  recording_state: RecordingState;
  upload_state: UploadState;
  video_id: string | null;
  file_name: string | null;
  duration_ms: number | null;
  size_bytes: number | null;
  checksum_sha256: string | null;
}

export interface SessionExportMetadata {
  session_id: string;
  room_id: string;
  started_at: string;
  stopped_at: string | null;
  config: {
    resolution?: ResolutionOption;
    fps?: FpsOption;
    max_duration_sec?: number;
    sync_audio_played?: boolean;
  };
  devices: SessionExportDeviceEntry[];
  exported_at: string;
}
