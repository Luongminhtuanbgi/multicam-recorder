/**
 * Tiện ích định dạng chuỗi, thời gian, mã mời và tên file dùng chung FE/BE.
 */

/** Bộ ký tự mã mời 6 ký tự loại bỏ 0/O/1/I để người dùng không đọc nhầm */
export const INVITE_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Định dạng đồng hồ đếm thời gian quay dạng `HH:MM:SS` (ví dụ `00:00:18`).
 */
export function formatDurationClock(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/**
 * Định dạng thời gian theo múi giờ Việt Nam (UTC+7) dạng `YYYYMMDD_HHmmss` hoặc `YYYYMMDD_HHmm`.
 */
export function formatVNDateTimeCompact(
  input: string | number | Date,
  includeSeconds = true
): string {
  const dt = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input;
  const baseMs = Number.isNaN(dt.getTime()) ? Date.now() : dt.getTime();
  const vnDate = new Date(baseMs + VN_OFFSET_MS);
  const y = vnDate.getUTCFullYear();
  const m = pad2(vnDate.getUTCMonth() + 1);
  const d = pad2(vnDate.getUTCDate());
  const hh = pad2(vnDate.getUTCHours());
  const mm = pad2(vnDate.getUTCMinutes());
  if (!includeSeconds) {
    return `${y}${m}${d}_${hh}${mm}`;
  }
  const ss = pad2(vnDate.getUTCSeconds());
  return `${y}${m}${d}_${hh}${mm}${ss}`;
}

/** Loại bỏ dấu tiếng Việt (ví dụ `"Cam Trái"` -> `"Cam Trai"`) */
export function stripVietnameseAccents(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/** Lọc an toàn cho phân đoạn tên file/thư mục: chỉ giữ `[A-Za-z0-9._-]` */
export function sanitizeFileSegment(part: string, fallback = 'unknown'): string {
  const cleaned = stripVietnameseAccents(part)
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
  return cleaned || fallback;
}

/** Lấy 4 ký tự cuối của deviceId để nhận diện nhanh thiết bị trên UI */
export function shortDeviceId(deviceId: string | null | undefined): string {
  const safe = sanitizeFileSegment(deviceId ?? '', '');
  if (!safe) return 'dev';
  return safe.slice(-4);
}

/**
 * Tạo tên hiển thị của video trên server:
 * `<camera_name bỏ dấu và khoảng trắng>_<yyyyMMdd>_<HHmm>`
 */
export function buildServerVideoDisplayName(
  cameraName: string,
  recordedAt: string | number | Date
): string {
  const cleanCam = stripVietnameseAccents(cameraName).replace(/[^A-Za-z0-9]+/g, '') || 'Camera';
  const timeStr = formatVNDateTimeCompact(recordedAt, false);
  return `${cleanCam}_${timeStr}`;
}

export interface LocalClipParsedName {
  recordedAtCompact: string;
  cameraNameSafe: string;
  sessionId: string;
  localVideoUid: string;
}

/**
 * Đặt tên file clip lưu cục bộ trên máy Remote:
 * `<recorded_at>__<camera_name>__<session_id|LOCAL>__<uuid>.mp4`
 */
export function buildLocalClipFileName(params: {
  recordedAt: string | number | Date;
  cameraName: string;
  sessionId?: string | null;
  localVideoUid: string;
}): string {
  const recordedPart = formatVNDateTimeCompact(params.recordedAt, true);
  const camPart = sanitizeFileSegment(params.cameraName, 'Camera').replace(/__/g, '_');
  const sessionPart = sanitizeFileSegment(params.sessionId || 'LOCAL', 'LOCAL').replace(/__/g, '_');
  const uidPart = sanitizeFileSegment(params.localVideoUid, 'uid').replace(/__/g, '_');
  return `${recordedPart}__${camPart}__${sessionPart}__${uidPart}.mp4`;
}

/** Tách thông tin từ tên file clip local `<recorded_at>__<camera_name>__<session_id>__<uuid>.mp4` */
export function parseLocalClipFileName(fileName: string): LocalClipParsedName | null {
  const base = fileName.replace(/\.mp4$/i, '');
  const parts = base.split('__');
  if (parts.length !== 4) return null;
  const [recordedAtCompact, cameraNameSafe, sessionId, localVideoUid] = parts;
  if (!recordedAtCompact || !cameraNameSafe || !sessionId || !localVideoUid) return null;
  return { recordedAtCompact, cameraNameSafe, sessionId, localVideoUid };
}
