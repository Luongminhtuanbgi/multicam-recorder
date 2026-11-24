import { z } from 'zod';
import { MESSAGES } from '../messages';

const PHONE_REGEX = /^0\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_CHARSET_REGEX = /^[A-Za-z0-9]+$/;
const VERIFY_CODE_REGEX = /^\d{6}$/;
const INVITE_CODE_REGEX = /^[A-Z0-9]{6}$/;
const SERVER_ADDRESS_REGEX =
  /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*|\d{1,3}(\.\d{1,3}){3})(:\d{1,5})?$/;

export const phoneSchema = z
  .string({ required_error: MESSAGES.PHONE_REQUIRED, invalid_type_error: MESSAGES.PHONE_INVALID })
  .trim()
  .min(1, MESSAGES.PHONE_REQUIRED)
  .regex(PHONE_REGEX, MESSAGES.PHONE_INVALID);

export const emailSchema = z
  .string({ required_error: MESSAGES.EMAIL_REQUIRED, invalid_type_error: MESSAGES.EMAIL_INVALID })
  .trim()
  .min(1, MESSAGES.EMAIL_REQUIRED)
  .max(100, MESSAGES.EMAIL_INVALID)
  .regex(EMAIL_REGEX, MESSAGES.EMAIL_INVALID)
  .transform((val) => val.toLowerCase());

/**
 * Ô nhập Email hoặc Số điện thoại dùng cho đăng nhập và khôi phục mật khẩu.
 * Nếu có ký tự `@` thì kiểm tra định dạng email, ngược lại kiểm tra SĐT 10 chữ số.
 */
export const loginIdSchema = z
  .string({
    required_error: MESSAGES.LOGIN_ID_REQUIRED,
    invalid_type_error: MESSAGES.LOGIN_ID_INVALID,
  })
  .trim()
  .min(1, MESSAGES.LOGIN_ID_REQUIRED)
  .superRefine((val, ctx) => {
    if (val.includes('@')) {
      if (val.length > 100 || !EMAIL_REGEX.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.LOGIN_ID_INVALID });
      }
    } else if (!PHONE_REGEX.test(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.LOGIN_ID_INVALID });
    }
  })
  .transform((val) => (val.includes('@') ? val.toLowerCase() : val));

export const passwordSchema = z
  .string({
    required_error: MESSAGES.PASSWORD_REQUIRED,
    invalid_type_error: MESSAGES.PASSWORD_REQUIRED,
  })
  .min(1, MESSAGES.PASSWORD_REQUIRED)
  .min(6, MESSAGES.PASSWORD_LENGTH)
  .max(20, MESSAGES.PASSWORD_LENGTH)
  .regex(PASSWORD_CHARSET_REGEX, MESSAGES.PASSWORD_CHARSET);

export const personNameSchema = z
  .string({ required_error: MESSAGES.NAME_REQUIRED, invalid_type_error: MESSAGES.NAME_REQUIRED })
  .trim()
  .min(1, MESSAGES.NAME_REQUIRED)
  .max(50, MESSAGES.NAME_TOO_LONG);

export const verifyCodeSchema = z
  .string({
    required_error: MESSAGES.VERIFY_CODE_FORMAT,
    invalid_type_error: MESSAGES.VERIFY_CODE_FORMAT,
  })
  .trim()
  .regex(VERIFY_CODE_REGEX, MESSAGES.VERIFY_CODE_FORMAT);

export const inviteCodeSchema = z
  .string({
    required_error: MESSAGES.INVITE_CODE_FORMAT,
    invalid_type_error: MESSAGES.INVITE_CODE_FORMAT,
  })
  .trim()
  .toUpperCase()
  .regex(INVITE_CODE_REGEX, MESSAGES.INVITE_CODE_FORMAT);

export const cameraNameSchema = z
  .string({
    required_error: MESSAGES.CAMERA_NAME_REQUIRED,
    invalid_type_error: MESSAGES.CAMERA_NAME_REQUIRED,
  })
  .trim()
  .min(1, MESSAGES.CAMERA_NAME_REQUIRED)
  .max(50, MESSAGES.CAMERA_NAME_REQUIRED);

export const uuidSchema = z.string().trim().uuid();

export const nonEmptyIdSchema = z.string().trim().min(1).max(100);

export const deviceTypeSchema = z
  .number()
  .int()
  .refine((val): val is 1 | 2 | 4 => val === 1 || val === 2 || val === 4, {
    message: 'device_type must be 1, 2, or 4',
  });

export const accountRoleSchema = z.enum(['controller', 'remote']);

export const verifyPurposeSchema = z.enum(['signup', 'forgot_password']);

export const resolutionSchema = z.enum(['720p', '1080p']);

export const fpsSchema = z
  .number()
  .int()
  .refine((val): val is 24 | 30 | 60 => val === 24 || val === 30 || val === 60, {
    message: 'fps must be 24, 30, or 60',
  });

export const paginationQuerySchema = z.object({
  index: z.coerce.number().int().min(0).default(0),
  count: z.coerce.number().int().min(1).max(50).default(20),
});

export const serverAddressSchema = z
  .string({
    required_error: MESSAGES.SERVER_ADDRESS_INVALID,
    invalid_type_error: MESSAGES.SERVER_ADDRESS_INVALID,
  })
  .trim()
  .min(1, MESSAGES.SERVER_ADDRESS_INVALID)
  .regex(SERVER_ADDRESS_REGEX, MESSAGES.SERVER_ADDRESS_INVALID)
  .transform((val) => {
    const withProtocol = /^https?:\/\//i.test(val) ? val : `http://${val}`;
    return withProtocol.replace(/\/+$/, '');
  });
