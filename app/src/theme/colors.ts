/**
 * Bảng màu dùng chung cho toàn bộ giao diện ứng dụng.
 * Toàn bộ component/screen import màu từ đây, không khai báo mã màu rời rạc bên ngoài.
 */
export const colors = {
  bgBase: '#0C0C10',
  bgElevated: '#141418',
  bgSurface: '#18181C',
  bgSurfaceActive: '#202024',
  bgOverlay: '#000000B3',

  borderSubtle: '#242428',
  borderFocus: '#EC9034',
  borderRecording: '#EC4C3C',

  primary: '#EC9034',
  primaryPressed: '#D47C24',
  primaryMuted: '#684018',
  primarySurface: '#302414',

  danger: '#EC4C3C',
  dangerPressed: '#C8382A',
  dangerSurface: '#3A1614',

  success: '#58A860',
  warning: '#E6B84C',

  textPrimary: '#F4F4F4',
  textSecondary: '#A0A0A8',
  textMuted: '#686870',
  textOnPrimary: '#0C0C10',
  textOnDanger: '#FFFFFF',

  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
