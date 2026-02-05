<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rb4V4qU4vKVmVlB2WCQHu2lJA3GEgg29

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   `npm run dev`

## Mobile Build Requirements (Android)

To generate a debug APK you need:
1. Android Studio installed.
2. JDK 17 (Usually bundled with Android Studio at `jbr` folder).

### Generate Debug APK (Windows PowerShell)

Use this robust command to set JAVA_HOME and build:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"; if (Test-Path "android") { cd android }; ./gradlew assembleDebug
```

The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`
