/**
 * fix-gradle.js — Paziify EAS Build Patcher
 * 
 * Runs AFTER Expo's prebuild on the EAS server.
 * Fixes two known issues with the Expo 55 / RN 0.83 template:
 * 1. Removes `enableBundleCompression` (removed from RN 0.74+)
 * 2. Ensures `codegenDir` uses .getParentFile() so it resolves to the directory, not the package.json file
 */

const fs = require('fs');
const path = require('path');

const gradlePath = path.resolve(process.cwd(), 'android', 'app', 'build.gradle');

console.log('[fix-gradle] Running Paziify Gradle patcher...');
console.log('[fix-gradle] Target:', gradlePath);

if (!fs.existsSync(gradlePath)) {
    console.error('[fix-gradle] ERROR: build.gradle not found! Prebuild may not have run yet.');
    process.exit(1);
}

let content = fs.readFileSync(gradlePath, 'utf8');
const original = content;

// Fix 1: Remove enableBundleCompression (removed in RN 0.74+)
content = content.replace(
    /^.*enableBundleCompression.*$/gm,
    '    // enableBundleCompression removed by Paziify (RN 0.83 incompatibility)'
);

// Fix 2: Ensure codegenDir resolves to the DIRECTORY, not the package.json file
// The template sometimes generates .getAbsoluteFile() without .getParentFile()
content = content.replace(
    /codegenDir = new File\((.*?)\.getAbsoluteFile\(\)\)/gs,
    (match, inner) => {
        if (match.includes('.getParentFile()')) return match; // already correct
        return `codegenDir = new File(${inner}.getParentFile().getAbsoluteFile())`;
    }
);

if (content !== original) {
    fs.writeFileSync(gradlePath, content, 'utf8');
    console.log('[fix-gradle] SUCCESS: build.gradle patched.');

    // Show what changed
    const originalLines = original.split('\n').slice(10, 25);
    const newLines = content.split('\n').slice(10, 25);
    originalLines.forEach((line, i) => {
        if (line !== newLines[i]) {
            console.log(`[fix-gradle]  - Line ${i + 11}: ${line.trim()}`);
            console.log(`[fix-gradle]  + Line ${i + 11}: ${newLines[i].trim()}`);
        }
    });
} else {
    console.log('[fix-gradle] No changes needed — file already correct.');
}
