import { Platform, type TextStyle } from 'react-native';

const monoFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/**
 * Các kiểu chữ dùng chung trong ứng dụng.
 * Bộ đếm thời gian và mã mời dùng font monospace + tabular-nums để không bị giật số.
 */
export const typography = {
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  } satisfies TextStyle,

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } satisfies TextStyle,

  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } satisfies TextStyle,

  bodySemiBold: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  } satisfies TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } satisfies TextStyle,

  mono: {
    fontFamily: monoFontFamily,
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,

  monoLarge: {
    fontFamily: monoFontFamily,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  } satisfies TextStyle,
} as const;
