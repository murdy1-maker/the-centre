# The Centre — Beginner's Step-by-Step Deployment Guide

This guide walks you through testing the mobile app on your own Android phone, deploying the backend, and preparing for the Google Play Store.

---

## Part 1: Test on Your Android Phone (Fastest Method — 5 Minutes)

You don't need to compile anything right away to see and use the app on your phone.

1. **Install Expo Go on Your Android Device**:
   - Open Google Play on your Android phone and install **Expo Go** (free).
2. **Run the Project Locally**:
   - On your computer in the `mobile/` directory, run:
     ```bash
     npm install
     npx expo start
     ```
   - A QR code will appear in your terminal.
3. **Scan the QR Code**:
   - Open Expo Go on your phone and tap **"Scan QR code"**.
   - The app will load instantly on your phone.
   - Note: The app includes an automatic fallback demo engine, so you can test entering queries and interacting with the Synthesis, Friction Map, and Claims tabs immediately even before the cloud backend is set up.

---

## Part 2: Generate an Installable Android File (.apk)

When you want an actual `.apk` file that installs directly as a standalone app on your Android phone (without Expo Go):

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to Expo (Free Account)**:
   ```bash
   eas login
   ```
3. **Build the Standalone APK**:
   ```bash
   cd mobile
   eas build -p android --profile preview
   ```
4. **Download & Install**:
   - When the build finishes, EAS provides a direct download link and QR code.
   - Download the `.apk` on your phone and tap to install (enable "Install unknown apps" when prompted).

---

## Part 3: Deploy the Backend (Free / Low Cost)

The backend runs the Python FastAPI pipeline (`backend/main.py`).

### Option A: Render (Easiest)
1. Push this project to GitHub.
2. Go to [render.com](https://render.com) and click **New Web Service**.
3. Select your repository and choose **Docker** runtime (using the provided `backend/Dockerfile`).
4. Under Environment Variables, add:
   - `GEMINI_API_KEY`: Your Gemini API key.
5. Click **Deploy**. Render will give you a public URL (e.g. `https://the-centre-api.onrender.com`).
6. In `mobile/src/services/api.ts`, update `DEFAULT_API_BASE_URL` with your Render URL.

---

## Part 4: Publishing to Google Play Store

When you are ready for public release on Google Play:

1. **Google Play Developer Account**:
   - Register at [play.google.com/console/signup](https://play.google.com/console/signup) ($25 USD one-time fee).
2. **Generate the Production App Bundle (.aab)**:
   ```bash
   cd mobile
   eas build -p android --profile production
   ```
   - This generates the `.aab` (Android App Bundle) required by Google Play.
3. **Store Listing Requirements**:
   - **App Name**: The Centre
   - **Short Description**: Multi-perspective factual analysis and synthesis.
   - **Full Description**: Deconstruct competing viewpoints, map core evidentiary conflicts, and read balanced central syntheses.
   - **Privacy Policy**: Use the prepared policy in `legal/PRIVACY_POLICY.md` (host on GitHub Pages, Notion, or your campaign/business website).
   - **Screenshots**: Capture 3-4 screenshots from your phone running the app.
   - **Target Audience / Content Rating**: Complete the standard questionnaire in the Console.
