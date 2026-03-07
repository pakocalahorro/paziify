const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to remove the obsolete 'enableBundleCompression' property
 * from the generated android/app/build.gradle file.
 * 
 * This property was removed in React Native 0.74+ but might still be injected
 * by some templates or older plugins in Expo 54 / RN 0.81 environments.
 */
const withRemoveEnableBundleCompression = (config) => {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = config.modResults.contents.replace(
                /^.*enableBundleCompression.*/gm,
                '// enableBundleCompression removed by Paziify Plugin'
            );
        }
        return config;
    });
};

module.exports = withRemoveEnableBundleCompression;
