import crypto from 'node:crypto';
import { INVITE_CODE_CHARSET } from '@multicam/shared';

const LOWER_ALPHANUM = '0123456789abcdefghijklmnopqrstuvwxyz';

export type EntityIdPrefix = 'u' | 'dv' | 'rm' | 'mb' | 'cmd' | 'up' | 'vd' | 'sid';

function randomFromCharset(length: number, charset: string): string {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += charset[bytes[i]! % charset.length];
  }
  return out;
}

/**
 * Sinh ID có tiền tố định danh thực thể (`u_`, `dv_`, `rm_`, `mb_`, `cmd_`, `up_`, `vd_`).
 */
export function createPrefixedId(prefix: EntityIdPrefix, randomLength = 8): string {
  return `${prefix}_${randomFromCharset(randomLength, LOWER_ALPHANUM)}`;
}

/** Sinh mã phiên quay `S` + 5 ký tự hoa/số (vd `S8F2A1`) */
export function createSessionId(): string {
  return `S${randomFromCharset(5, INVITE_CODE_CHARSET)}`;
}

/** Sinh mã mời phòng 6 ký tự hoa/số không chứa `0/O/1/I` (vd `8F2A1C`) */
export function createInviteCode(): string {
  return randomFromCharset(6, INVITE_CODE_CHARSET);
}
