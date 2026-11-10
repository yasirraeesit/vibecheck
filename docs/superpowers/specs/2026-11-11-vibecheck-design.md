# VibeCheck: The Contactless Party Polygraph
## Design Document & Technical Specification

**Author:** Google Antigravity & Yasir Raees  
**Date:** 2026-11-11  
**Target:** DEV Community Presage SmartSpectra SDK Challenge (Deadline: Nov 22, 2026)  
**Track:** Most Creative or Delightful Use (Eligible for Best Overall)  
**Platform:** Standalone Android Mobile App (React Native via Expo Prebuild / EAS Build + SmartSpectra Android SDK)  

---

## 1. Intent & The Why

The **Presage SmartSpectra SDK** is a contactless human-sensing breakthrough that extracts physiological signals (pulse rate, HRV, breathing rate, and facial micro-expressions) using standard camera optics without wearables.

Most existing hackathon submissions under `#presagechallenge` cluster around familiar desktop tropes: generic breathing circles, screen-dimming workspace widgets, or virtual cats.

**VibeCheck** breaks the mold by turning camera-based biometric sensing into a high-energy, laugh-out-loud social party game that runs **100% standalone on an Android smartphone**. Players put their friends on the "hot seat" and interrogate them with funny, spicy, or provocative questions while the phone's camera acts as a retro-futuristic lie detector HUD. 

In this **Phone-Only Standalone (Option B)** setup:
* No laptop, no companion server, and no cables are required during gameplay.
* The interrogator points the phone's camera directly at the suspect (or props it up between them).
* The phone's camera captures facial video, feeds frames directly into the native **SmartSpectra Android SDK** (`com.presagetech:smartspectra:1.0.25`), and runs real-time biometric analysis on-device.
* When the suspect squelches a laugh, holds their breath, or experiences a sudden pulse surge, the HUD flashes alarm sirens, buzzes with haptic pulses, and issues a dramatic verdict—capping off with an exportable "Mugshot & Lie Certificate" card.

---

## 2. Goals, Non-Goals, & Anti-Goals

### 2.1 Goals
1. **100% Standalone Mobile Application:** Run completely on an Android phone without relying on an external computer or companion server during gameplay.
2. **Native SmartSpectra Android SDK Integration:** Integrate `com.presagetech:smartspectra:1.0.25` via an Expo Config Plugin / Prebuild native module (`SmartSpectraModule.kt`), bridging real-time vitals to React Native.
3. **Seamless Installation from Laptop to Mobile:** Support building a standalone APK via **EAS Build** (cloud build, no local Android Studio/JDK required) or local `npx expo run:android` for direct installation on the user's phone.
4. **Cinematic Biometric HUD:** Full-screen camera viewfinder with real-time cybernetic targeting reticle, live 60 FPS cardiac pleth waveform, breathing rate indicator, and facial tension / blink gauges.
5. **Structured Party Game Flow:** 
   * Phase 1: 5-second Baseline Calibration (resting heart rate & breathing).
   * Phase 2: Hot-Seat Question Selection (deck of 50+ questions across Funny, Spicy, and Absurd, plus custom questions).
   * Phase 3: Interrogation & Real-Time Bio-Feedback (live telemetry spikes).
   * Phase 4: Suspenseful Countdown & Comedic Verdict ("DECEPTION DETECTED" vs "COLD-BLOODED TRUTH").
   * Phase 5: Shareable "Mugshot / Lie Certificate" card generation via `react-native-view-shot` + `expo-sharing`.
6. **Built-In Dev Simulator Mode:** Include an organic physiological simulation toggle so the entire game UI, sound effects, and deck can be developed and tested in Expo Go before compiling the native APK.
7. **Explicit Privacy & Consent:** Clear consent screen explaining that all camera processing is done locally on-device with zero cloud telemetry.

### 2.2 Non-Goals
* Clinical diagnostic or forensic admissibility (this is explicitly an entertaining party game).
* Cloud account registration, user logins, or centralized databases (zero-friction launch).
* Complex multi-device multiplayer networking (single-phone "pass and play" physical social dynamic).

### 2.3 Anti-Goals
* No creepy covert surveillance: the camera UI prominently displays a red `[REC / SCANNING]` badge and requires explicit "Suspect Ready" consent.
* No sterile medical graphs: numbers must be paired with dramatic, gameified visual feedback (surges, alarms, cybernetic reticles).

---

## 3. Approaches Considered & Selected Architecture

| Approach | Architecture | Decision | Justification |
|---|---|---|---|
| **A: Dual-Device Station** | Laptop webcam feeds Node SDK; phone acts as remote viewer | Rejected by User | Requires laptop nearby; cannot be played freely on the go at parties. |
| **B: Phone-Only Standalone (Selected)** | React Native + Expo Prebuild / Config Plugin + Native Android `SmartSpectra` AAR | **Selected** | **True mobile-native experience.** Full mobility; phone camera does all sensing; installs via APK (`eas build` / `adb install`). |
| **C: Phone Camera Wi-Fi Streaming** | Phone camera streams raw video across Wi-Fi to laptop | Rejected | High latency, brittle Wi-Fi connection, packet drops. |

---

## 4. User Experience & Game State Machine

```
[Start / Consent Screen]
       │ (User Taps "Enter Interrogation")
       ▼
[Phase 1: Calibration] (5 seconds)
  - Suspect's face centered in HUD reticle
  - SmartSpectra SDK samples baseline HR (e.g., 72 BPM) and respiratory rhythm
       │ (Calibration Complete)
       ▼
[Phase 2: Question Selection]
  - Deck: "Spicy", "Funny", "Unfiltered", or "Custom Question"
  - Interrogator reads question aloud
       │ (Taps "Begin Interrogation")
       ▼
[Phase 3: Interrogation & Bio-HUD]
  - Real-time 60 FPS pulse pleth waveform SVG
  - Heart Rate Spike Meter (Δ from baseline)
  - Respiration arrest / shallow breath flags
  - Micro-expression twitch detector
       │ (Interrogator Taps "Lock In Verdict")
       ▼
[Phase 4: The Verdict Countdown] (3 seconds)
  - Dramatic drumroll / siren build-up
  - Haptic heartbeat pulses (`expo-haptics`)
  - Verdict Banner: "DECEPTION DETECTED" (Red) OR "COLD-BLOODED TRUTH" (Green)
       │ (Displays Lie Report)
       ▼
[Phase 5: Mugshot / Lie Certificate Export]
  - Frozen camera snapshot of suspect with biometric telemetry stamp
  - "Save to Photos" / "Share with Friends" button
  - "Next Suspect" button resets flow
```

---

## 5. Technical Specifications

### 5.1 Technology Stack
* **Framework:** React Native (Expo SDK 52) with Expo Prebuild / Config Plugin
* **Native Android Dependency:** `com.presagetech:smartspectra:1.0.25` (via Maven Central)
* **Native Android Bridge:** Custom Kotlin Native Module (`SmartSpectraModule.kt` + `SmartSpectraPackage.kt`)
* **Camera:** `expo-camera` or native `SmartSpectraView` preview
* **HUD Graphics & Animations:** `react-native-svg` + React Native Animated / Reanimated
* **Audio & Haptics:** `expo-av` (sci-fi scanner blips, heartbeat thump, siren alarm, chime) + `expo-haptics`
* **Card Export:** `react-native-view-shot` + `expo-sharing`
* **Build & Install Pipeline:** `eas build -p android --profile preview` (generates standalone installable APK)

### 5.2 Native Android Module & React Native Event Contract

#### Android Native Bridge (`SmartSpectraModule.kt`)
```kotlin
package com.vibecheck.smartspectra

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.presagetech.smartspectra.SmartSpectraSdk

class SmartSpectraModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "SmartSpectraModule"

    @ReactMethod
    fun initialize(apiKey: String, promise: Promise) {
        try {
            SmartSpectraSdk.getInstance().setApiKey(apiKey)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e.message)
        }
    }

    private fun sendVitalsEvent(data: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onVitalsUpdate", data)
    }
}
```

#### TypeScript Event Contract
```typescript
export interface VitalsUpdateEvent {
  timestamp: number;
  pulseBpm: number;          // e.g. 78.4
  breathingRate: number;     // breaths per min e.g. 15.2
  hrvVariance: number;       // ms (rMSSD)
  faceTension: number;       // 0.0 to 1.0 (micro-expressions & blink rate)
  confidence: number;        // 0.0 to 1.0
  status: 'calibrating' | 'locked' | 'unstable' | 'lost';
}
```

### 5.3 Polygraph Scoring Engine (`polygraphEngine.ts`)
The JavaScript layer owns game logic:
1. **Calibration:** Samples resting metrics over a 5-second window to establish `baselineBpm` and resting respiration.
2. **Delta Tracking:** Calculates real-time $\Delta\text{BPM} = \text{pulseBpm} - \text{baselineBpm}$.
3. **Breath-Hold Flagging:** Flags sudden drops in respiratory cycle.
4. **Deception Scoring:** Computes composite probability using autonomic stress weights:
   $$\text{Score} = 0.45 \cdot \min\left(1.0, \frac{\Delta \text{BPM}}{25}\right) + 0.30 \cdot \mathbb{I}_{\text{breath\_hold}} + 0.25 \cdot \text{TensionScore}$$
5. **Procedural Pleth Waveform:** Generates a fluid 60 FPS dicrotic SVG pulse wave driven by `pulseBpm`, ensuring jitter-free rendering on mobile.

---

## 6. Project Directory Layout

```
vibecheck-mobile/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-11-11-vibecheck-design.md  # This document
├── plugins/                                    # Expo Config Plugins
│   └── withSmartSpectra.js                    # Injects Maven & Android native module
├── android/                                    # Generated via Expo Prebuild
│   └── app/src/main/java/com/vibecheck/
│       ├── SmartSpectraModule.kt              # Native bridge to SmartSpectraSdk
│       └── SmartSpectraPackage.kt
├── assets/
│   ├── audio/                                 # Retro sound FX (heartbeat, siren, chime)
│   ├── icon.png
│   └── splash.png
├── src/
│   ├── components/
│   │   ├── CameraHudOverlay.tsx              # Cybernetic reticle & telemetry bars
│   │   ├── PulseWaveform.tsx                 # 60 FPS procedural SVG pleth waveform
│   │   ├── QuestionCard.tsx                  # Party question banner
│   │   └── LieCertificateCard.tsx            # Shareable mugshot view
│   ├── data/
│   │   └── partyQuestions.json               # 50+ spicy/funny questions
│   ├── hooks/
│   │   ├── useSmartSpectra.ts                # Native listener + dev simulator toggle
│   │   ├── useHaptics.ts
│   │   └── useSoundEffects.ts
│   ├── screens/
│   │   ├── ConsentScreen.tsx
│   │   ├── CalibrationScreen.tsx
│   │   ├── InterrogationScreen.tsx
│   │   └── VerdictScreen.tsx
│   ├── types/
│   │   └── telemetry.ts
│   └── utils/
│       └── polygraphEngine.ts                # Scoring heuristic
├── App.tsx
├── app.json                                  # Expo config (with plugin declaration)
├── eas.json                                  # EAS Build configuration for APK output
├── package.json
└── README.md                                 # DEV Challenge submission guide
```

---

## 7. Submission Deliverables for DEV Challenge
1. **Public GitHub Repository:** Clean code, modular architecture, and MIT license.
2. **Downloadable Android APK:** Prebuilt APK linked in the release section so judges can install it in seconds on any Android phone.
3. **Demo Video (60-90 seconds):** Filmed directly showing two people playing VibeCheck on the phone: asking a question, showing the camera locking on, pulse spiking, siren alarm flashing, and the generated lie card.
4. **DEV Post:** Published under `#presagechallenge` and `#devchallenge` detailing:
   * Inspiration & why a standalone mobile polygraph stands out.
   * How SmartSpectra contactless vitals work under the hood.
   * Architecture (React Native + Expo Prebuild + native Android AAR bridge + biometric heuristic).
   * Consent and on-device privacy guarantee.

---

## 8. What is Left to the Builder
* Specific retro synth sound assets (synthesized tones or local WAV assets).
* Exact neon HUD color styling (Cyan `#00F0FF`, Crimson `#FF0055`, Amber `#FFB800`).
* Compilation of the 50 party question entries into the JSON seed file.
