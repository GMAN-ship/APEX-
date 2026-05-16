Packaging the Vite web app as an Android APK with Capacitor

1. Build the web assets:

```bash
cd webapp
npm run build
```

2. Install Capacitor and create the native project (do this on a machine with Android SDK installed):

```bash
npm install @capacitor/core @capacitor/cli --save
npx cap init "APEX EA" com.apex.ea --web-dir=dist
npx cap add android
```

3. Copy the built web assets to the native project and open Android Studio:

```bash
npx cap copy android
npx cap open android
```

4. In Android Studio, build an APK or bundle (Generate Signed Bundle / APK...).

Notes:
- You need Android SDK, JDK, and Android Studio installed.
- For production, configure proper Android permissions and a secure keystore.
- Consider using EAS or other CI to automate builds if you prefer managed Expo flows.
