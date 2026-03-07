const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Paziify Gradle Fix Plugin
 * 
 * Fixes two known bugs in the Expo 55 / RN 0.83 build.gradle template,
 * applied directly during `expo prebuild` (both locally and on EAS).
 * 
 * Bug 1: `enableBundleCompression` was removed in RN 0.76+ but still appears in some templates.
 * Bug 2: `codegenDir` missing `.getParentFile()` causes MODULE_NOT_FOUND for codegen CLI.
 */
const withGradleFix = (config) => {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            let contents = config.modResults.contents;

            // Fix 1: Remove ANY line containing enableBundleCompression
            contents = contents.replace(
                /^.*enableBundleCompression.*$/gm,
                '    // enableBundleCompression removed by Paziify plugin (not available in RN 0.76+)'
            );

            // Fix 2: Ensure codegenDir points to the DIRECTORY (not the package.json file)
            // The template incorrectly generates .getAbsoluteFile() without .getParentFile()
            // This causes: Cannot find module '.../codegen/package.json/lib/cli/...'
            contents = contents.replace(
                /(codegenDir\s*=\s*new File\(.*?\.trim\(\)\))\.getAbsoluteFile\(\)/s,
                '$1.getParentFile().getAbsoluteFile()'
            );

            config.modResults.contents = contents;
        }
        return config;
    });
};

module.exports = withGradleFix;
