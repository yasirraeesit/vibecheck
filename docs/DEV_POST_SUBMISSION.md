# 🚨 VibeCheck: The Contactless Party Polygraph Powered by SmartSpectra
*Submission for the Presage SmartSpectra SDK Challenge on DEV Community*

**Tags:** `#presagechallenge`, `#devchallenge`, `#reactnative`, `#showdev`

---

## What I Built

Most developer applications utilizing biometric sensing skew toward serious clinical tools or solitary breathing guides. When I saw the **Presage SmartSpectra SDK Challenge**, I wanted to take a completely different path: **What if contactless biometric sensing could power an electrifying, laugh-out-loud party game?**

Introducing **VibeCheck**—the contactless party polygraph that turns your smartphone into a retro-futuristic "human lie detector".

Players put their friends in the hot seat, pointing their phone camera at the "suspect" to calibrate a 5-second baseline of their resting pulse and breathing rhythm. Then comes the interrogation: drawing from a deck of 50+ spicy, hilarious, and absurd party questions (or typing in your own). 

As the suspect answers, the live cybernetic HUD tracks their autonomic nervous system:
- **60 FPS Procedural Pleth Waveform:** Showing real-time cardiac cadence.
- **Cardiac Surge Meter:** Highlighting pulse spikes ($\Delta\text{BPM}$) over baseline.
- **Respiration Arrest Flag:** Catching subtle breath-holds or nervous hyperventilation.
- **Micro-Expression Strain:** Measuring involuntary facial twitches.

When the answer is locked in, suspenseful sirens ring out, the phone buzzes with haptic alarms, and VibeCheck stamps down a verdict: **DECEPTION DETECTED** or **COLD-BLOODED TRUTH**—complete with an exportable "Mugshot & Lie Certificate" card to share on social media.

---

## Demo & Repository

- **Public GitHub Repository:** [github.com/yasirraeesit/vibecheck](https://github.com/yasirraeesit/vibecheck)
- **Demo Video (YouTube / Loom):** [Link to 60-second gameplay video demo]
- **Downloadable APK:** Available under GitHub Releases for Android testing.

---

## How I Integrated the Presage SmartSpectra SDK

VibeCheck is built with **React Native** and **Expo SDK 52**, integrating Presage's official Android SDK (`com.presagetech:smartspectra:1.0.25`).

### 1. Native Android Module Bridge
Because Expo applications run in a managed environment, I engineered a custom Expo Config Plugin (`plugins/withSmartSpectra.js`) paired with a native Kotlin bridge module (`SmartSpectraModule.kt`). 

The native bridge handles the SmartSpectra lifecycle:
```kotlin
@ReactMethod
fun initialize(apiKey: String, promise: Promise) {
    SmartSpectraSdk.getInstance().apply {
        setApiKey(apiKey)
    }
    promise.resolve(true)
}
```
When optical photoplethysmography detects subtle skin micro-flushes and facial movement, it marshals the signals directly onto React Native's device event emitter (`RCTDeviceEventEmitter`) as structured vitals packets (`onVitalsUpdate`).

### 2. Autonomic Deception Scoring Algorithm
Inside `src/utils/polygraphEngine.ts`, VibeCheck evaluates three composite indicators of autonomic arousal:
$$\text{Deception Score} = 0.45 \cdot \min\left(1.0, \frac{\Delta \text{BPM}}{25}\right) + 0.30 \cdot \mathbb{I}_{\text{breath\_hold}} + 0.25 \cdot \text{TensionScore}$$
- If a suspect's pulse surges by +20 BPM and they freeze their breathing, the score spikes past the $0.60$ threshold, sounding retro sci-fi sirens and triggering haptic vibration patterns.

### 3. Built-in Physiological Dev Simulator
To ensure anyone (including hackathon evaluators without local native Android compilers) can test the game instantly, I built an organic physiological simulator right into the start screen. It accurately models sinus arrhythmia and autonomic stress surges in pure TypeScript.

---

## Camera Consent & Responsible Privacy

Contactless physiological sensing requires clear, uncompromised consent:
1. **Explicit Consent Gate:** The app cannot enter the interrogation or calibration state without the user explicitly reading and accepting the privacy terms.
2. **100% On-Device Processing:** Optical signals are processed strictly in device RAM by the SmartSpectra engine. Zero video frames or biometric telemetry packets are uploaded to external cloud servers.
3. **Transparent Framing:** The HUD prominently displays a red `[LIVE SCAN / SMARTSPECTRA]` indicator so all participants know when the camera is actively evaluating metrics.
4. **Entertainment Purpose:** The app explicitly informs participants that it is an entertaining party game, not a medical or forensic diagnostic tool.

---

## What I Learned & What's Next

Building **VibeCheck** completely changed how I think about camera-based biosensing. Removing the friction of wearables opens up new genres of social computing—turning subtle biological signals into interactive comedy and camaraderie.

For next steps, I plan to:
- Add a 2-phone local Bluetooth link so the interrogator can hold one phone while the second phone acts as a stationary interrogation tripod camera.
- Expand the party deck with user-submitted community packs.

Thank you to **Presage Technologies** and **DEV Community** for hosting such a creative and forward-looking challenge!

