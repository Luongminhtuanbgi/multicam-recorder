import type { ConfigContext, ExpoConfig } from 'expo/config';

// Node 22+ đọc trực tiếp file .ts để dùng chung bảng màu từ một nơi duy nhất
const { colors } = require('./src/theme/colors.ts') as typeof import('./src/theme/colors');

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Multi-Cam Recorder',
  slug: 'multicam-recorder',
  scheme: 'multicam',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: colors.bgBase,
  android: {
    package: 'com.it4409.multicamrecorder',
    permissions: ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
    adaptiveIcon: {
      backgroundColor: colors.bgBase,
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  experiments: {
    typedRoutes: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true,
          buildArchs: ['arm64-v8a'],
        },
      },
    ],
    './plugins/withShortCmakePaths',
  ],
});
