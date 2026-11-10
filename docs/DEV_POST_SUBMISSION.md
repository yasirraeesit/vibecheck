# VibeCheck: A Contactless Party Lie Detector (Built with SmartSpectra)

*My submission for the Presage SmartSpectra SDK Challenge on DEV Community.*

**Tags:** `#presagechallenge`, `#devchallenge`, `#reactnative`, `#showdev`

---

## The Idea

When I saw the **Presage SmartSpectra SDK Challenge**, I noticed a pattern: almost everyone was building breathing circles, workspace calmers, or virtual pets. Those are useful, but I wanted to try something different. 

What if you could use camera-based biometric tracking as a fun party game with your friends?

That's how **VibeCheck** was born. It turns your phone into a retro sci-fi lie detector:

1. **The Setup:** You point your phone camera at a friend sitting across from you.
2. **The Calibration:** The app takes 5 seconds to lock onto their face and record their resting heart rate and breathing pace.
3. **The Question:** You draw a funny or spicy question from the deck (or write your own on the spot).
4. **The Interrogation:** As your friend talks, a live cybernetic HUD tracks their vitals on screen:
   - **Real-Time Heart Wave:** A smooth, running pulse wave that speeds up as their heart rate climbs.
   - **Pulse Spike Meter:** Shows how many beats per minute their heart jumped compared to resting baseline.
   - **Breath-Hold Alert:** Flags if they suddenly freeze their breathing while trying to think of an excuse.
5. **The Verdict:** After they finish answering, you hit **"Lock In Answer"**. The app sounds a countdown siren, vibrates with haptics, and drops the verdict: **CAUGHT IN A LIE!** or **CLEAN TRUTH!**, with a shareable result card you can save or send to the group chat.

---

## Links

- **GitHub Repository:** [github.com/yasirraeesit/vibecheck](https://github.com/yasirraeesit/vibecheck)
- **Demo Video:** [Link to your 60-second video demo]
- **Downloadable APK:** Linked in GitHub Releases for testing on any Android phone.

---

## How It Works Under the Hood

VibeCheck is built with **React Native (Expo SDK 52)** and connects to Presage's native Android SDK (`com.presagetech:smartspectra:1.0.25`).

### 1. Camera & Native Android Bridge
Presage's SDK analyzes video frames directly to pick up optical changes in skin blood flow (photoplethysmography). To use this inside React Native, I wrote a Kotlin module (`SmartSpectraModule.kt`) and an Expo config plugin (`plugins/withSmartSpectra.js`). 

The native Android module initializes the Presage SDK and sends real-time pulse and breathing updates into React Native through event listeners:

```kotlin
@ReactMethod
fun initialize(apiKey: String, promise: Promise) {
    SmartSpectraSdk.getInstance().apply {
        setApiKey(apiKey)
    }
    promise.resolve(true)
}
```

### 2. The Stress & Deception Heuristic
In `src/utils/polygraphEngine.ts`, the app calculates a weighted stress score from three physical reactions:
- **Heart rate increase:** How high their pulse climbed compared to their 5-second resting baseline.
- **Breathing hesitation:** Whether their breathing rate dropped below 10 breaths per minute right as they answered.
- **Facial tension:** Micro-expression changes and blink rate shifts.

If their heart jumps by more than 15–20 BPM and they hold their breath, the deception score triggers the alarm and flashes the red warning HUD.

### 3. Built-in Dev Simulator Mode
I know judges and community reviewers don't always have a physical Android phone or another person in the room to test with. Right on the home screen, there's a **"Dev Simulator"** switch. When turned on, the app runs an internal heartbeat oscillator in pure TypeScript. You can press the **"Spike Vitals"** button to simulate what happens when someone gets nervous and test the whole game loop instantly.

---

## Privacy & Camera Consent

Biometric tracking should always be transparent and consensual:

- **100% On-Device:** Video frames are analyzed locally in phone memory by the SmartSpectra SDK. Nothing is saved to disk, and no video or biometric data is ever sent to any cloud server.
- **No Sign-Up or Accounts:** The app opens right away. No email, no tracking, no permissions beyond the camera.
- **Upfront Notice:** The app clearly states on the first screen that it is just a game for laughs with friends—not a real medical or legal test.

---

## What I Learned

Working with contactless optical sensing was an eye-opener. Not having to put a smartwatch or finger clip on someone completely changes how natural an interaction feels. You can just point your phone, ask a question, and let their body language and heartbeat do the talking.

Hope you enjoy trying it out! Let me know in the comments what questions you'd add to the deck.
