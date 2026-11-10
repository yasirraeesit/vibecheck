# VibeCheck: The Contactless Party Polygraph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build **VibeCheck**, a standalone React Native Android mobile game for the Presage SmartSpectra SDK Challenge, that turns camera-based contactless human sensing into a comedic, high-energy party polygraph game with retro cybernetic HUD, audio sirens, haptics, and shareable lie certificates.

**Architecture:** A React Native (Expo SDK 52) mobile application integrating the native `com.presagetech:smartspectra:1.0.25` Android AAR via an Expo Config Plugin and custom Kotlin native module (`SmartSpectraModule.kt`). A client-side polygraph engine computes resting baselines, cardiac surges, breath-holds, and deception scores, supported by a 60 FPS procedural SVG pleth waveform, party question deck, and an organic dev simulator for instant testing before APK compilation.

**Tech Stack:** React Native, Expo SDK 52, TypeScript, Jest, `expo-camera`, `expo-av`, `expo-haptics`, `react-native-svg`, `react-native-view-shot`, `expo-sharing`, Kotlin (Android Native Module), EAS Build.

**Spec:** [`docs/superpowers/specs/2026-11-11-vibecheck-design.md`](file:///C:/Users/Yasir%20Raees/.gemini/antigravity/scratch/vibecheck-mobile/docs/superpowers/specs/2026-11-11-vibecheck-design.md)

## Global Constraints

- **Platform Target:** Android 8.0+ (API 26+) standalone APK via EAS Build / Expo Prebuild.
- **Node & Tooling:** Node.js v24+, Expo SDK 52+, TypeScript 5+.
- **Native Dependency:** `com.presagetech:smartspectra:1.0.25` from Maven Central.
- **Game State Machine:** 5 discrete phases (Consent -> Calibration -> Question Selection -> Interrogation -> Verdict / Certificate).
- **Privacy Standard:** Zero cloud telemetry; all camera frame processing occurs strictly on-device.

## Review Focus

- **Sudden pulse spike during calibration:** If the suspect laughs or shifts during the 5s baseline, baseline $\text{BPM}$ must not skew above physiological limits (clamp baseline to $45 \le \text{BPM} \le 130$).
- **Camera permission denied:** App must gracefully show an informative permission recovery screen instead of crashing.
- **Zero vitals / face lost during interrogation:** HUD must indicate `UNSTABLE / FACE LOST` reticle without resetting ongoing question progress.
- **Audio asset load failure / silent mode:** Polygraph and verdict flow must continue seamlessly even if device is on mute or audio fails to load.
- **View shot snapshot failure:** Lie certificate export must fall back to saving a structured text/SVG card if camera buffer snapshot is temporarily unavailable.

---

### Task 1: Project Scaffolding, Types, & Build Config

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `eas.json`
- Create: `tsconfig.json`
- Create: `src/types/telemetry.ts`
- Test: `src/types/__tests__/types.test.ts`

**Interfaces:**
- Produces: `VitalsUpdateEvent`, `BiometricTelemetry`, `GameState`, `PartyQuestion`, `VerdictResult`.

- [ ] **Step 1: Write the failing test for type contracts**

```typescript
import { VitalsUpdateEvent, BiometricTelemetry, GameState } from '../telemetry';

describe('Telemetry Types Contract', () => {
  it('validates a complete vitals packet structure', () => {
    const packet: VitalsUpdateEvent = {
      timestamp: Date.now(),
      pulseBpm: 78.5,
      breathingRate: 14.2,
      hrvVariance: 42.1,
      faceTension: 0.25,
      confidence: 0.95,
      status: 'locked',
    };
    expect(packet.pulseBpm).toBeGreaterThan(0);
    expect(['calibrating', 'locked', 'unstable', 'lost']).toContain(packet.status);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/types/__tests__/types.test.ts`
Expected: FAIL with module/file not found.

- [ ] **Step 3: Implement project configuration and telemetry contracts**

Create `package.json`, `app.json`, `eas.json`, `tsconfig.json`, and `src/types/telemetry.ts` defining `VitalsUpdateEvent`, `BiometricTelemetry`, `GameState` (`'consent' | 'calibration' | 'question' | 'interrogation' | 'verdict'`), and `VerdictResult`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/types/__tests__/types.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json app.json eas.json tsconfig.json src/types/
git commit -m "chore: scaffold VibeCheck project configuration and telemetry types"
```

---

### Task 2: Polygraph Scoring Engine (`polygraphEngine.ts`)

**Files:**
- Create: `src/utils/polygraphEngine.ts`
- Test: `src/utils/__tests__/polygraphEngine.test.ts`

**Interfaces:**
- Consumes: `VitalsUpdateEvent` from `src/types/telemetry.ts`
- Produces: 
  - `computeDeceptionScore(currentBpm: number, baselineBpm: number, isBreathHeld: boolean, faceTension: number): number`
  - `evaluateVerdict(score: number): VerdictResult`
  - `PolygraphSession` class managing the 5-second calibration window and continuous analysis.

- [ ] **Step 1: Write failing tests for deception scoring and calibration**

```typescript
import { computeDeceptionScore, evaluateVerdict, PolygraphSession } from '../polygraphEngine';

describe('polygraphEngine', () => {
  it('calculates low deception for resting baseline', () => {
    const score = computeDeceptionScore(72, 70, false, 0.1);
    expect(score).toBeLessThan(0.4);
    const verdict = evaluateVerdict(score);
    expect(verdict.isDeceptive).toBe(false);
  });

  it('triggers high deception on cardiac surge and breath hold', () => {
    const score = computeDeceptionScore(102, 72, true, 0.8);
    expect(score).toBeGreaterThanOrEqual(0.6);
    const verdict = evaluateVerdict(score);
    expect(verdict.isDeceptive).toBe(true);
    expect(verdict.confidencePercentage).toBeGreaterThanOrEqual(60);
  });

  it('clamps baseline during 5-second calibration window', () => {
    const session = new PolygraphSession();
    session.feedCalibrationSample(75);
    session.feedCalibrationSample(78);
    session.feedCalibrationSample(72);
    expect(session.getBaselineBpm()).toBeCloseTo(75, 0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/polygraphEngine.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `polygraphEngine.ts`**

Implement formula:
$$\text{Score} = 0.45 \cdot \min\left(1.0, \frac{\max(0, \text{currentBpm} - \text{baselineBpm})}{25}\right) + 0.30 \cdot \mathbb{I}_{\text{breath\_hold}} + 0.25 \cdot \text{faceTension}$$
Clamp baseline between 45 and 130 BPM. Set threshold for `isDeceptive` at $\ge 0.60$.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/polygraphEngine.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/polygraphEngine.ts src/utils/__tests__/polygraphEngine.test.ts
git commit -m "feat: implement polygraph scoring engine with autonomic stress heuristic"
```

---

### Task 3: Party Questions Deck & Management Engine

**Files:**
- Create: `src/data/partyQuestions.json`
- Create: `src/utils/questionDeck.ts`
- Test: `src/utils/__tests__/questionDeck.test.ts`

**Interfaces:**
- Produces: 
  - `getRandomQuestion(category?: string): PartyQuestion`
  - `getAllCategories(): string[]`
  - `QuestionDeck` class with shuffle, next, and custom question injection.

- [ ] **Step 1: Write failing tests for QuestionDeck**

```typescript
import { QuestionDeck } from '../questionDeck';

describe('QuestionDeck', () => {
  it('loads and draws questions across categories', () => {
    const deck = new QuestionDeck();
    const q = deck.drawNext();
    expect(q.text.length).toBeGreaterThan(10);
    expect(['spicy', 'funny', 'absurd', 'custom']).toContain(q.category);
  });

  it('allows injecting a custom interrogation question', () => {
    const deck = new QuestionDeck();
    deck.addCustomQuestion('Did you steal my sandwich from the breakroom?');
    const custom = deck.drawNext();
    expect(custom.text).toBe('Did you steal my sandwich from the breakroom?');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/questionDeck.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `partyQuestions.json` and `questionDeck.ts`**

Populate 50+ funny, spicy, and absurd party interrogation cards, and implement `QuestionDeck` with deterministic shuffle and custom insertion.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/questionDeck.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/partyQuestions.json src/utils/questionDeck.ts src/utils/__tests__/questionDeck.test.ts
git commit -m "feat: implement party questions deck with categories and custom questions"
```

---

### Task 4: Biometric Telemetry Hook with Organic Dev Simulator

**Files:**
- Create: `src/hooks/useSmartSpectra.ts`
- Test: `src/hooks/__tests__/useSmartSpectra.test.ts`

**Interfaces:**
- Consumes: `NativeEventEmitter` or native `SmartSpectraModule`
- Produces: 
  - `useSmartSpectra(options: { simulatorMode?: boolean }): { telemetry: BiometricTelemetry, isConnected: boolean, setStimulus: (stressLevel: number) => void }`

- [ ] **Step 1: Write failing tests for the hook and simulator engine**

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSmartSpectra } from '../useSmartSpectra';

describe('useSmartSpectra Hook', () => {
  it('emits organic resting telemetry in simulator mode', () => {
    const { result } = renderHook(() => useSmartSpectra({ simulatorMode: true }));
    expect(result.current.telemetry.pulseBpm).toBeGreaterThanOrEqual(60);
    expect(result.current.telemetry.breathingRate).toBeGreaterThan(10);
  });

  it('dynamically responds to stress stimulus', () => {
    const { result } = renderHook(() => useSmartSpectra({ simulatorMode: true }));
    act(() => {
      result.current.setStimulus(0.9); // high stress stimulus
    });
    expect(result.current.telemetry.pulseBpm).toBeGreaterThan(80);
    expect(result.current.telemetry.facialTensionScore).toBeGreaterThan(0.5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/hooks/__tests__/useSmartSpectra.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `useSmartSpectra.ts`**

Implement native listener binding to `NativeModules.SmartSpectraModule` via `DeviceEventEmitter`. If native module is absent (e.g. running in Expo Go or Jest), automatically fall back to an organic cardiac oscillator simulator that responds to question stimulus.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/hooks/__tests__/useSmartSpectra.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSmartSpectra.ts src/hooks/__tests__/useSmartSpectra.test.ts
git commit -m "feat: implement useSmartSpectra hook with native event bridge and organic dev simulator"
```

---

### Task 5: Audio & Haptic Feedback Controllers

**Files:**
- Create: `src/hooks/useSoundEffects.ts`
- Create: `src/hooks/useHaptics.ts`
- Test: `src/hooks/__tests__/audioHaptics.test.ts`

**Interfaces:**
- Produces:
  - `useHaptics().pulseHeartbeat()`, `useHaptics().triggerAlarmPattern()`
  - `useSoundEffects().playSiren()`, `useSoundEffects().playChime()`, `useSoundEffects().playHeartbeatThump()`

- [ ] **Step 1: Write failing tests for audio/haptic trigger calls**

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useHaptics } from '../useHaptics';

describe('useHaptics', () => {
  it('exposes trigger functions safely with mock fallbacks', () => {
    const { result } = renderHook(() => useHaptics());
    expect(typeof result.current.pulseHeartbeat).toBe('function');
    expect(typeof result.current.triggerAlarmPattern).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/hooks/__tests__/audioHaptics.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `useHaptics.ts` and `useSoundEffects.ts`**

Utilize `expo-haptics` (`Haptics.impactAsync`, `Haptics.notificationAsync`) and `expo-av` (`Audio.Sound`), wrapping calls in try/catch to avoid crashes on unsupported devices or silent mode.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/hooks/__tests__/audioHaptics.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSoundEffects.ts src/hooks/useHaptics.ts src/hooks/__tests__/audioHaptics.test.ts
git commit -m "feat: add audio and haptic feedback hooks for interrogation and alarms"
```

---

### Task 6: Procedural SVG Pulse Waveform & Cybernetic Camera HUD

**Files:**
- Create: `src/components/PulseWaveform.tsx`
- Create: `src/components/CameraHudOverlay.tsx`
- Test: `src/components/__tests__/hudComponents.test.ts`

**Interfaces:**
- Consumes: `BiometricTelemetry` from `src/types/telemetry.ts`
- Produces:
  - `<PulseWaveform bpm={number} color={string} width={number} height={number} />` (generates SVG path at 60 FPS)
  - `<CameraHudOverlay telemetry={BiometricTelemetry} targetLocked={boolean} />`

- [ ] **Step 1: Write failing test for PulseWaveform SVG generator**

```typescript
import { generateDicroticWavePath } from '../PulseWaveform';

describe('generateDicroticWavePath', () => {
  it('generates a valid SVG path containing systolic peak and dicrotic notch', () => {
    const path = generateDicroticWavePath(100, 300, 80, 0);
    expect(path).toMatch(/^M\s*0/);
    expect(path).toContain('C');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/__tests__/hudComponents.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `PulseWaveform.tsx` and `CameraHudOverlay.tsx`**

Implement the dicrotic cardiac wave generator in `react-native-svg` and the cybernetic targeting reticle with corner brackets, red `[REC]` badge, delta BPM badge, and breath status bar.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/__tests__/hudComponents.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PulseWaveform.tsx src/components/CameraHudOverlay.tsx src/components/__tests__/hudComponents.test.ts
git commit -m "feat: create 60 FPS procedural SVG pulse waveform and cybernetic camera HUD"
```

---

### Task 7: Game Screens & Core State Machine

**Files:**
- Create: `src/screens/ConsentScreen.tsx`
- Create: `src/screens/CalibrationScreen.tsx`
- Create: `src/screens/InterrogationScreen.tsx`
- Create: `src/screens/VerdictScreen.tsx`
- Test: `src/screens/__tests__/gameFlow.test.ts`

**Interfaces:**
- Manages full game progression through 5 states (`consent` -> `calibration` -> `question` -> `interrogation` -> `verdict`).

- [ ] **Step 1: Write failing tests for state transitions**

```typescript
import { nextGameState } from '../stateMachine';

describe('Game State Transitions', () => {
  it('progresses in strict sequence', () => {
    expect(nextGameState('consent')).toBe('calibration');
    expect(nextGameState('calibration')).toBe('question');
    expect(nextGameState('question')).toBe('interrogation');
    expect(nextGameState('interrogation')).toBe('verdict');
    expect(nextGameState('verdict')).toBe('calibration');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/screens/__tests__/gameFlow.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement screens and navigation controller**

Build `ConsentScreen` (camera permission & consent terms), `CalibrationScreen` (5s countdown & reticle), `InterrogationScreen` (question card + live HUD), and `VerdictScreen` (dramatic reveal banner).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/screens/__tests__/gameFlow.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/screens/ src/screens/__tests__/gameFlow.test.ts
git commit -m "feat: implement game screens and interrogation state machine"
```

---

### Task 8: Shareable "Lie Certificate / Mugshot" Card Generator

**Files:**
- Create: `src/components/LieCertificateCard.tsx`
- Test: `src/components/__tests__/certificateCard.test.ts`

**Interfaces:**
- Consumes: `VerdictResult`, `PartyQuestion`, snapshot URI
- Produces: `<LieCertificateCard />` component with `captureAndShare()` action via `react-native-view-shot` and `expo-sharing`.

- [ ] **Step 1: Write failing test for LieCertificateCard component render**

```typescript
import { formatVerdictCertificateData } from '../LieCertificateCard';

describe('formatVerdictCertificateData', () => {
  it('formats badge, confidence, and telemetry stamp for share card', () => {
    const data = formatVerdictCertificateData({
      isDeceptive: true,
      confidencePercentage: 88,
      bpmDelta: 24,
      questionText: 'Did you secretly eat the last donut?',
    });
    expect(data.verdictTitle).toBe('DECEPTION DETECTED');
    expect(data.deltaLabel).toBe('+24 BPM SPIKE');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/components/__tests__/certificateCard.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `LieCertificateCard.tsx`**

Build the high-contrast retro card layout with frozen mugshot snapshot, biometric watermark, timestamp, and one-tap "Share to Social / Save" button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/components/__tests__/certificateCard.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/LieCertificateCard.tsx src/components/__tests__/certificateCard.test.ts
git commit -m "feat: implement shareable lie certificate card exporter"
```

---

### Task 9: Native Android Module & Expo Config Plugin

**Files:**
- Create: `plugins/withSmartSpectra.js`
- Create: `android/app/src/main/java/com/vibecheck/SmartSpectraModule.kt`
- Create: `android/app/src/main/java/com/vibecheck/SmartSpectraPackage.kt`
- Test: `plugins/__tests__/configPlugin.test.ts`

**Interfaces:**
- Consumes: Expo config `app.json`
- Produces:
  - Expo Config Plugin injecting Maven Central and `implementation("com.presagetech:smartspectra:1.0.25")` into `build.gradle`.
  - Kotlin Native Module bridging `SmartSpectraSdk` lifecycle and telemetry callback events to React Native.

- [ ] **Step 1: Write failing test for Expo Config Plugin**

```typescript
import { modifyAppBuildGradle } from '../withSmartSpectra';

describe('withSmartSpectra Config Plugin', () => {
  it('injects SmartSpectra maven dependency into build.gradle', () => {
    const original = `dependencies {\n    implementation("com.facebook.react:react-android")\n}`;
    const modified = modifyAppBuildGradle(original);
    expect(modified).toContain('com.presagetech:smartspectra:1.0.25');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest plugins/__tests__/configPlugin.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `withSmartSpectra.js` and Kotlin bridge files**

Write the Expo config plugin to inject the repository and dependency, and implement `SmartSpectraModule.kt` to initialize `SmartSpectraSdk` and post `onVitalsUpdate` to React Native's `RCTDeviceEventEmitter`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest plugins/__tests__/configPlugin.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add plugins/withSmartSpectra.js android/ plugins/__tests__/configPlugin.test.ts
git commit -m "feat: add Expo config plugin and native Kotlin module for SmartSpectra Android SDK"
```

---

### Task 10: App Assembly, EAS Build Configuration, & DEV Challenge Submission Post

**Files:**
- Modify: `App.tsx`
- Modify: `README.md`
- Create: `docs/DEV_POST_SUBMISSION.md`
- Test: `npm test` (full project test suite)

**Interfaces:**
- Consumes: All screens, hooks, and components
- Produces: Complete working standalone mobile app and published-ready DEV Community challenge post template.

- [ ] **Step 1: Write integration test for App root component**

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App Root', () => {
  it('renders initial consent screen on startup', () => {
    const { getByText } = render(<App />);
    expect(getByText(/VIBECHECK/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Wire `App.tsx`, build instructions, and `DEV_POST_SUBMISSION.md`**

Connect state machine into root `App.tsx`. Populate `README.md` with setup and APK generation steps (`npx expo start`, `eas build -p android --profile preview`). Create `DEV_POST_SUBMISSION.md` following the DEV Presage challenge template.

- [ ] **Step 4: Run full test suite to verify everything passes**

Run: `npm test`
Expected: All test suites PASS (100% passing).

- [ ] **Step 5: Commit**

```bash
git add App.tsx README.md docs/DEV_POST_SUBMISSION.md
git commit -m "feat: assemble complete VibeCheck application with EAS build config and DEV submission doc"
```

