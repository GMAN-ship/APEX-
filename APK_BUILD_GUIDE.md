# Building and Releasing Android APK

## Overview

This project now includes automated Android APK building through GitHub Actions. The workflow builds your React web app (webapp) using Vite and packages it into an Android APK using Capacitor.

## Automated Build Process

### GitHub Actions Workflow Location
- File: `.github/workflows/build-apk.yml`
- Triggers on:
  - Push to `main` or `develop` branches
  - Pull requests to `main`
  - Manual workflow dispatch

### Build Steps
1. Checks out code
2. Sets up Node.js, Java, and Android SDK
3. Installs webapp dependencies
4. Builds web assets with Vite
5. Initializes Capacitor (first time only)
6. Copies assets to Android project
7. Builds APK using Gradle
8. Uploads artifact to Actions

## Accessing Builds

### Option 1: GitHub Actions Artifacts
1. Go to your fork: `https://github.com/GMAN-ship/APEX-`
2. Click **Actions** tab
3. Select the latest workflow run
4. Under **Artifacts**, download the APK file

### Option 2: Create a Release with APK
Tag your commit to automatically create a release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The workflow will automatically:
- Build the APK
- Create a GitHub Release
- Upload the APK as a release asset

## Local Development

To build APK locally (requires Android SDK installed):

```bash
cd webapp
npm install
npm run build
npm install @capacitor/core @capacitor/cli
npx cap init "APEX EA" com.apex.ea --web-dir=dist
npx cap add android
npx cap copy android
cd android
./gradlew assembleDebug
```

APK will be at: `webapp/android/app/build/outputs/apk/debug/app-debug.apk`

## Release Builds

For production APK builds (signed), you'll need to:
1. Create a keystore file
2. Configure Android Studio with signing credentials
3. Use `assembleRelease` instead of `assembleDebug`

See Android documentation for signing apps.

## Installation on Device

```bash
adb install webapp/android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

- **Build Fails**: Check GitHub Actions logs for detailed error messages
- **Capacitor Issues**: Run `npx cap update` if dependencies are outdated
- **Android SDK**: The workflow automatically sets up SDK, but ensure `build-tools-version` and `api-levels` match your target
