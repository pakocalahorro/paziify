const fs = require('fs');
const path = require('path');

// EAS runs from the project root, so we resolve relative to process.cwd()
const gradlePath = path.resolve(process.cwd(), 'android', 'app', 'build.gradle');

console.log('[fix-gradle] Looking for build.gradle at:', gradlePath);

if (fs.existsSync(gradlePath)) {
    console.log('[fix-gradle] Found build.gradle. Removing enableBundleCompression...');
    let content = fs.readFileSync(gradlePath, 'utf8');

    const original = content;
    // Remove any line containing enableBundleCompression
    content = content.replace(/^.*enableBundleCompression.*$/gm, '// enableBundleCompression removed by Paziify fix script');

    if (content !== original) {
        fs.writeFileSync(gradlePath, content, 'utf8');
        console.log('[fix-gradle] SUCCESS: build.gradle patched.');
    } else {
        console.log('[fix-gradle] Line not found. No changes made.');
    }
} else {
    console.log('[fix-gradle] build.gradle not found at expected path. Skipping.');
}
