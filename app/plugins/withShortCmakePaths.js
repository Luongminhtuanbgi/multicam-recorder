const path = require('path');
const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * Expo Config Plugin rút gọn đường dẫn build CMake/Ninja trên Windows
 * để tránh vượt giới hạn MAX_PATH (260 ký tự) khi biên dịch các module C++ native.
 */
module.exports = function withShortCmakePaths(config) {
  if (process.platform !== 'win32') {
    return config;
  }

  return withProjectBuildGradle(config, (mod) => {
    if (mod.modResults.contents.includes('CMAKE_OBJECT_PATH_MAX')) {
      return mod;
    }

    const monorepoRootForward = path
      .resolve(__dirname, '../..')
      .replace(/\\/g, '/');

    const snippet = `
subprojects { subproject ->
  def configureShortCmake = {
    subproject.android {
      externalNativeBuild {
        cmake {
          buildStagingDirectory = file("${monorepoRootForward}/.cxx/\${subproject.name}")
        }
      }
      defaultConfig {
        externalNativeBuild {
          cmake {
            arguments "-DCMAKE_OBJECT_PATH_MAX=180"
          }
        }
      }
    }
  }
  subproject.plugins.withId("com.android.library") { configureShortCmake() }
  subproject.plugins.withId("com.android.application") { configureShortCmake() }
}
`;

    mod.modResults.contents = mod.modResults.contents.replace(
      /allprojects\s*\{[\s\S]*?\n\}/,
      (match) => `${match}\n${snippet}`
    );

    return mod;
  });
};
