let withAppBuildGradle = (config, fn) => config;
let createRunOncePlugin = (fn) => fn;

try {
  const plugins = require('@expo/config-plugins');
  withAppBuildGradle = plugins.withAppBuildGradle;
  createRunOncePlugin = plugins.createRunOncePlugin;
} catch {
  try {
    const plugins = require('expo/config-plugins');
    withAppBuildGradle = plugins.withAppBuildGradle;
    createRunOncePlugin = plugins.createRunOncePlugin;
  } catch {
    // Graceful fallback for test runners
  }
}

const SMARTSPECTRA_DEPENDENCY = '    implementation("com.presagetech:smartspectra:1.0.25")';

/**
 * Injects com.presagetech:smartspectra into the android/app/build.gradle dependencies block.
 */
function modifyAppBuildGradle(buildGradle) {
  if (buildGradle.includes('com.presagetech:smartspectra')) {
    return buildGradle;
  }

  const dependenciesRegex = /dependencies\s*\{/;
  if (dependenciesRegex.test(buildGradle)) {
    return buildGradle.replace(
      dependenciesRegex,
      `dependencies {\n${SMARTSPECTRA_DEPENDENCY}`
    );
  }

  return `${buildGradle}\n\ndependencies {\n${SMARTSPECTRA_DEPENDENCY}\n}\n`;
}

const withSmartSpectra = (config) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = modifyAppBuildGradle(config.modResults.contents);
    return config;
  });
};

module.exports = createRunOncePlugin(withSmartSpectra, 'withSmartSpectra', '1.0.0');
module.exports.modifyAppBuildGradle = modifyAppBuildGradle;
