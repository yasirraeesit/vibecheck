# 🔍 VibeCheck: The Contactless Party Polygraph
> **Built for the Presage SmartSpectra SDK Challenge on DEV Community**  
> *Category Entry: Most Creative or Delightful Use (Eligible for Best Overall)*

[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2052-blue.svg)](https://reactnative.dev)
[![SmartSpectra](https://img.shields.io/badge/Presage-SmartSpectra%20SDK%20v1.0.25-cyan.svg)](https://smartspectra.presagetech.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ⚡ What is VibeCheck?

**VibeCheck** is a high-energy, comedic party game that turns your Android smartphone into a retro-futuristic "human lie detector" using standard camera optics.

Powered by the **Presage SmartSpectra SDK**, VibeCheck measures contactless human physiological signals—including real-time pulse (photoplethysmogram), heart rate variability (HRV), respiration rate, and micro-expression strain—without any wearables or finger sensors.

### The Problem with Existing Hackathon Submissions
Most submissions under `#presagechallenge` gravitate toward familiar patterns: breathing visualizers, desk dimmers, or virtual cats. VibeCheck flips the script by applying biometric sensing to a hilarious social format: grilling your friends in the hot seat with spicy questions and watching their vitals surge in real time on a cybernetic HUD!

---

## 🎮 How to Play

1. **Phase 1: Calibrate Baseline (5s):**  
   The suspect centers their face in the cybernetic HUD reticle. VibeCheck calculates their resting baseline heart rate and respiration rhythm.
2. **Phase 2: The Interrogation:**  
   The interrogator draws a spicy or funny card from the 50+ question deck (or types a custom interrogation question).
3. **Phase 3: Live Biometric HUD:**  
   As the suspect answers, the app displays:
   - **60 FPS Procedural Pleth Waveform (SVG):** Visualizes the arterial pulse wave and heartbeat cadence.
   - **Cardiac Surge Meter:** Flags $\Delta\text{BPM}$ increases relative to baseline.
   - **Breath-Hold Apnea Flag:** Detects when a suspect suddenly halts their breathing under interrogation pressure.
   - **Facial Tension Gauge:** Measures micro-strain and blink frequency shifts.
4. **Phase 4: The Dramatic Verdict:**  
   Suspenseful countdown siren followed by a loud alarm or exoneration chime:
   - `DECEPTION DETECTED (88% CONFIDENCE)` or `COLD-BLOODED TRUTH (94% CONFIDENCE)`.
5. **Phase 5: Mugshot & Lie Certificate Export:**  
   Generates a downloadable, high-contrast retro interrogation card with biometric stamps, ready to share on social media or save to photos!

---

## 🏗️ Technical Architecture

```
                    ┌───────────────────────────────┐
                    │ Android Front/Rear Camera Feed │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │     com.presagetech:smartspectra:1.0.25 (Native AAR)    │
       │       - Facial Optical Photoplethysmography (rPPG)     │
       │       - Cardiac Waveform & Breathing Rate Extraction   │
       └────────────────────────────┬────────────────────────────┘
                                    │ Native Android Bridge
                                    ▼ (SmartSpectraModule.kt)
       ┌─────────────────────────────────────────────────────────┐
       │            React Native / Expo JavaScript Engine        │
       │  - PolygraphSession & Autonomic Stress Scoring Engine   │
       │  - 60 FPS Procedural SVG Waveform (react-native-svg)    │
       │  - Audio Sirens (expo-av) & Haptics (expo-haptics)      │
       │  - Lie Certificate Exporter (react-native-view-shot)    │
       └─────────────────────────────────────────────────────────┘
```

### Autonomic Deception Heuristic
$$\text{Deception Score} = 0.45 \cdot \min\left(1.0, \frac{\Delta \text{BPM}}{25}\right) + 0.30 \cdot \mathbb{I}_{\text{breath\_hold}} + 0.25 \cdot \text{TensionScore}$$
- Score $\ge 0.60$ triggers the **DECEPTION DETECTED** verdict state.

---

## 🚀 Quickstart & Setup

### 1. Clone & Install
```bash
git clone https://github.com/yasirraeesit/vibecheck.git
cd vibecheck-polygraph
npm install
```

### 2. Run Local Development (with Dev Simulator)
```bash
npx expo start
```
Scan the QR code with the **Expo Go** app on your Android or iOS device.  
*VibeCheck includes a built-in physiological simulator toggle right on the start screen so you can test and demo the entire party game experience even without compiling native Android binaries.*

### 3. Build Standalone Android APK (EAS Build)
To produce an installable standalone `.apk` containing the compiled `com.presagetech:smartspectra` native binary:
```bash
npx eas-cli build -p android --profile preview
```
Once the cloud build finishes, download the `.apk` and install it directly on your Android phone!

---

## 🛡️ Privacy & Consent
- **100% On-Device Processing:** Camera frames are analyzed locally in device memory by SmartSpectra.
- **Zero Cloud Storage:** No camera frames, videos, or biometric telemetry packets are ever uploaded to any external server.
- **Explicit Consent:** The game begins with an upfront consent screen stating its entertainment purpose.

---

## 📜 License
MIT License. Created for the DEV Presage SmartSpectra SDK Challenge 2026.

