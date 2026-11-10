# VibeCheck: The Contactless Party Lie Detector

> Built for the **Presage SmartSpectra SDK Challenge** on DEV Community.  
> Entry category: *Most Creative or Delightful Use*.

[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2052-blue.svg)](https://reactnative.dev)
[![SmartSpectra](https://img.shields.io/badge/Presage-SmartSpectra%20SDK%20v1.0.25-cyan.svg)](https://smartspectra.presagetech.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is VibeCheck?

**VibeCheck** is a mobile party game that turns your phone into a retro sci-fi lie detector.

Instead of needing a smartwatch or finger clip, it uses your phone's camera and the **Presage SmartSpectra SDK** to measure heart rate, breathing, and expressions through the air. You point the camera at a friend, ask spicy questions, and watch their vitals react live on screen!

---

## How It Works in 4 Steps

1. **Calibrate (5 seconds):** Point the camera at your friend's face. The app locks on and records their resting baseline heart rate and breathing pace.
2. **Draw a Question:** Pick a card from the deck of 50+ funny and spicy questions, or type your own on the fly.
3. **The Interrogation:** Watch the live cybernetic HUD as they answer:
   - **Live Pulse Wave:** Running heart wave that speeds up as their pulse climbs.
   - **Spike Meter:** Tracks how many beats per minute their heart jumped compared to resting.
   - **Breath-Hold Alert:** Flags if they freeze their breathing under pressure.
4. **The Verdict:** Tap **"Lock In Answer"**. The app sounds a countdown siren, vibrates with haptics, and reveals the verdict: **CAUGHT IN A LIE!** or **CLEAN TRUTH!** You can then export a shareable report card to send to the group chat.

---

## Tech Stack & Architecture

- **Frontend:** React Native with Expo SDK 52
- **Sensors:** Presage SmartSpectra Android SDK (`com.presagetech:smartspectra:1.0.25`)
- **Native Bridge:** Custom Kotlin module (`SmartSpectraModule.kt`) and Expo config plugin (`plugins/withSmartSpectra.js`)
- **HUD & Graphics:** Procedural 60 FPS SVG cardiac wave (`react-native-svg`)
- **Audio & Haptics:** `expo-av` and `expo-haptics`
- **Result Sharing:** `react-native-view-shot` and `expo-sharing` (with text share fallback)

---

## Quickstart & Testing

### 1. Clone & Install
```bash
git clone https://github.com/yasirraeesit/vibecheck.git
cd vibecheck
npm install
```

### 2. Run Locally in Expo Go (with Dev Simulator)
```bash
npm start
```
Scan the QR code with **Expo Go** on your Android or iOS phone.

*Tip: On the home screen, there is a **Dev Simulator** toggle. When turned ON, you can test the entire game loop without needing another person seated in front of the camera.*

### 3. Build Standalone Android APK (EAS Build)
```bash
eas build -p android --profile preview
```
Once the cloud build finishes, download the `.apk` file directly to your phone.

---

## Privacy & Safety

- **100% On-Device:** Video frames are analyzed locally in device memory. Nothing is ever saved or sent to any server.
- **Zero Logins:** No account or personal info is collected.
- **Just for Fun:** The app clearly reminds players that it is a party game for laughs, not a real polygraph.

---

## License
MIT License. Created for the DEV Presage SmartSpectra SDK Challenge 2026.
