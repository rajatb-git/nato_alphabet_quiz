# Alpha Bravo

A NATO phonetic alphabet quiz app built with React Native and Expo. Learn Alfa, Bravo, Charlie and all 26 code words through quizzes, flashcards, morse code practice, spelling drills, and daily challenges.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [EAS CLI](https://docs.expo.dev/eas/) — Expo's build service

```bash
npm install -g eas-cli
```

## Getting Started

```bash
pnpm install
pnpm start
```

## Building the APK for Google Play

### Option 1: Cloud build with EAS (recommended)

EAS Build compiles your app on Expo's servers — no Android SDK or Java required locally.

#### 1. Log in to your Expo account

```bash
eas login
```

If you don't have an account, create one at [expo.dev](https://expo.dev/signup).

#### 2. Configure the build

Run the interactive setup. This creates an `eas.json` file:

```bash
eas build:configure
```

Or create `eas.json` manually in the project root:

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

#### 3. Build a preview APK (for testing)

```bash
eas build --platform android --profile preview
```

This produces a `.apk` file you can install directly on any Android device.

#### 4. Build a production AAB (for Play Store)

```bash
eas build --platform android --profile production
```

This produces a signed `.aab` (Android App Bundle) — the format required by Google Play.

EAS manages your signing keystore automatically. On the first build, it will generate one and store it securely. You can also provide your own keystore via `eas credentials`.

#### 5. Download the build

Once the build finishes, EAS prints a download URL. You can also find it at:

```bash
eas build:list
```

### Option 2: Local build (requires Android SDK)

If you prefer to build locally without EAS:

#### 1. Install dependencies

- Java Development Kit (JDK) 17
- Android SDK (via Android Studio or command-line tools)
- Set `ANDROID_HOME` environment variable

#### 2. Generate the native project

```bash
npx expo prebuild --platform android
```

This creates the `android/` directory with a standard Gradle project.

#### 3. Build a debug APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

#### 4. Build a signed release APK/AAB

Create a keystore (one-time):

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore alpha-bravo.keystore \
  -alias alpha-bravo \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

Add signing config to `android/app/build.gradle` under `android { signingConfigs { ... } }`, then:

```bash
cd android
./gradlew assembleRelease    # produces .apk
./gradlew bundleRelease      # produces .aab (for Play Store)
```

The release AAB will be at `android/app/build/outputs/bundle/release/app-release.aab`.

## Publishing to Google Play

### 1. Create a developer account

Sign up at [Google Play Console](https://play.google.com/console/) ($25 one-time fee).

### 2. Create a new app

In the Play Console, click **Create app** and fill in:
- App name: **Alpha Bravo**
- Default language: English
- App or game: App
- Free or paid: Free

### 3. Complete the store listing

Use the content in `store-assets/play-store-listing.md` for:
- **Short description** (80 chars)
- **Full description**

Upload the required graphics:
- **App icon**: `assets/icon.png` (512x512 — Play Console will resize)
- **Feature graphic**: `store-assets/feature-graphic.png` (1024x500)
- **Screenshots**: Take 2-8 phone screenshots (use an emulator or device)

### 4. Complete the content rating questionnaire

In Play Console, go to **Policy > App content > Content rating** and complete the IARC questionnaire. This app has no violence, no user-generated content, and no data collection — it should receive an **Everyone / PEGI 3** rating.

### 5. Set up the privacy policy

Host `PRIVACY_POLICY.md` at a public URL (GitHub Pages, your website, etc.) and enter the URL in the Play Console under **Policy > App content > Privacy policy**.

### 6. Fill out the data safety section

In **Policy > App content > Data safety**, declare:
- The app does **not** collect or share any user data
- All data is stored on-device only
- No analytics, advertising, or tracking SDKs

### 7. Upload the AAB and release

Go to **Release > Production** (or start with **Testing > Internal testing**):
1. Click **Create new release**
2. Upload the `.aab` file from your build
3. Add release notes (e.g., "Initial release")
4. Review and roll out

### 8. Submit with EAS (optional shortcut)

If you used EAS Build, you can submit directly:

```bash
eas submit --platform android --profile production
```

This requires a Google Play service account key. See [EAS Submit docs](https://docs.expo.dev/submit/android/) for setup.

## Store Assets

| File | Size | Purpose |
|------|------|---------|
| `assets/icon.png` | 1024x1024 | App icon |
| `store-assets/feature-graphic.png` | 1024x500 | Play Store feature graphic |
| `store-assets/play-store-listing.md` | — | Store listing copy |
| `PRIVACY_POLICY.md` | — | Privacy policy |

## Generating Icons

To regenerate all icons and store graphics:

```bash
node scripts/generate-icons.js
```

## License

Private — not for redistribution.
