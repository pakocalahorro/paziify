const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Paziify Gradle Fix Plugin
 * 
 * Fixes known issues with the Expo 55 / RN 0.83 build.gradle template.
 * Applied directly during `expo prebuild` (both locally and on EAS).
 * 
 * Fix 1: Remove `enableBundleCompression` (removed in RN 0.76+)
 * Fix 2: Replace the ENTIRE codegenDir line with the correct version.
 *         EAS servers use a template that generates `.getAbsoluteFile()` 
 *         without `.getParentFile()`, causing MODULE_NOT_FOUND for codegen CLI.
 *         We replace the entire line to avoid any regex matching issues.
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

            // Fix 2: Replace the ENTIRE codegenDir line unconditionally.
            // This handles all variants of the template (with or without .getParentFile()).
            // The correct value: resolve the @react-native/codegen package.json path,
            // then call .getParentFile() to get its DIRECTORY (not the file itself).
            contents = contents.replace(
                /^.*codegenDir\s*=.*$/gm,
                '    codegenDir = new File(["node", "--print", "require.resolve(\'@react-native/codegen/package.json\', { paths: [require.resolve(\'react-native/package.json\')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()'
            );

            config.modResults.contents = contents;
        }
        return config;
    });
};

module.exports = withGradleFix;
