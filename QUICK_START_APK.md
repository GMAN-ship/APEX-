# 📱 APEX- Mobile APK - Production Deployment Guide

## Overview

Your **Ghost-Master Trading Terminal** is now a fully-automated, production-ready Android APK build system. No more PDFs—your app is the product.

## 🚀 What's Been Set Up

✅ **GitHub Actions CI/CD Pipeline** — Automatic APK builds on every push  
✅ **Capacitor Integration** — Web app wrapped in native Android container  
✅ **Automated Release System** — One git tag creates a complete release with APK  
✅ **Production Blueprint** — Complete documentation of architecture and deployment  

## 📦 Getting Your APK

### Option 1: Latest Build Artifacts (Fastest)
```
1. Go to: https://github.com/GMAN-ship/APEX-/actions
2. Click the latest workflow run
3. Scroll to "Artifacts" section
4. Download: apk
```

### Option 2: Official Release (Best for Distribution)
```
1. Go to: https://github.com/GMAN-ship/APEX-/releases
2. Find the version you want (currently v0.2.0-apk)
3. Download: app-debug.apk
4. Share the link with users
```

### Option 3: Create New Release (Recommended)
```bash
# Tag a commit for official release
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automatically:
# - Builds the APK
# - Creates a GitHub Release
# - Attaches the APK file
```

## 📱 Installing on Android Device

### Via ADB (Developer Mode)
```bash
# Connect device via USB
adb install path/to/app-debug.apk

# Or install from your local workspace
adb install webapp/android/app/build/outputs/apk/debug/app-debug.apk
```

### Via File Transfer
```
1. Copy .apk file to phone (USB, cloud, email, etc.)
2. Open file manager
3. Tap .apk file
4. Follow installation prompts
5. Allow unknown sources if prompted
```

## 🛠️ Local Build (Optional)

If you want to build locally without GitHub:

```bash
cd /workspaces/APEX-/webapp

# Install dependencies
npm install

# Build web assets
npm run build

# Setup Capacitor (first time only)
npm install @capacitor/core @capacitor/cli --save
npx cap init "APEX EA" com.apex.ea --web-dir=dist
npx cap add android

# Copy web assets to Android project
npx cap copy android

# Build APK
cd android
chmod +x gradlew
./gradlew assembleDebug

# APK is now at: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📋 Project Structure

```
/workspaces/APEX-/
├── .github/workflows/
│   └── build-apk.yml          ← Automated build pipeline
├── docs/
│   └── PRODUCTION_BLUEPRINT.html  ← Architecture overview
├── webapp/                     ← React/Vite web app
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── capacitor.config.json   ← APK configuration
├── mobile/                     ← Expo React Native (alternative)
├── supabase/                   ← Realtime database schema
├── integration/                ← MT5 bridge code
└── APK_BUILD_GUIDE.md          ← Detailed build instructions
```

## 🔄 Build Workflow Explained

### Automatic Triggers
- ✅ Push to `main` branch → Builds APK
- ✅ Push to `develop` branch → Builds APK  
- ✅ Create git tag → Builds APK + Creates Release
- ✅ Manual dispatch from Actions tab → Builds APK

### Build Steps (Automated)
1. **Checkout** code from GitHub
2. **Setup** Node.js, Java, Android SDK
3. **Install** webapp dependencies
4. **Build** web app with Vite
5. **Init** Capacitor (creates native Android project)
6. **Copy** web assets to Android project
7. **Gradle** compiles APK
8. **Upload** APK as artifact
9. **Release** APK if tag detected

## 📊 Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/build-apk.yml` | CI/CD pipeline configuration |
| `webapp/capacitor.config.json` | APK metadata (app name, bundle ID, etc.) |
| `webapp/package.json` | Dependencies and build scripts |
| `docs/PRODUCTION_BLUEPRINT.html` | Architecture and deployment guide |
| `APK_BUILD_GUIDE.md` | Detailed technical guide |
| `QUICK_START_APK.md` | This file |

## 🎯 Common Tasks

### Check Build Status
```bash
# View all workflows
https://github.com/GMAN-ship/APEX-/actions

# View specific workflow
https://github.com/GMAN-ship/APEX-/actions/workflows/build-apk.yml
```

### Release New Version
```bash
# Make your changes
git add .
git commit -m "Feature: Add new trading signal"

# Tag for release
git tag v1.1.0
git push origin v1.1.0

# GitHub Actions handles the rest!
```

### View Release History
```
https://github.com/GMAN-ship/APEX-/releases
```

### Debug Build Failures
```
1. Go to Actions tab
2. Click failed workflow
3. Expand step logs
4. Check Android SDK, Java, or dependency issues
```

## ⚙️ Configuration

### Change App Name/ID
Edit `webapp/capacitor.config.json`:
```json
{
  "appId": "com.apex.ea",           ← Change to your bundle ID
  "appName": "APEX EA",              ← Change to your app name
  "webDir": "dist"
}
```

### Update Build Tools
Edit `.github/workflows/build-apk.yml`:
```yaml
- uses: android-actions/setup-android@v3
  with:
    api-levels: '34'                 ← Target API level
    build-tools-version: '34.0.0'    ← Build tools version
```

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails in Actions | Check workflow logs for error details |
| APK too large | Minify assets in `vite.config.ts` |
| App crashes on launch | Check Supabase credentials in webapp |
| Can't install on phone | Enable "Unknown Sources" in Settings |
| Can't see Actions tab | Enable in Settings → Actions |

## 🎓 Learn More

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Vite Guide**: https://vitejs.dev
- **Android Development**: https://developer.android.com
- **GitHub Actions**: https://docs.github.com/en/actions

## ✨ Next Steps

1. ✅ Monitor first build at: https://github.com/GMAN-ship/APEX-/actions
2. ✅ Download APK when ready
3. ✅ Test on Android device
4. ✅ Make improvements to your trading terminal
5. ✅ Tag new releases as you iterate
6. ✅ Share APK links with users

---

**Your production APK pipeline is live and ready. Happy trading! 🚀**

Last updated: May 16, 2026
