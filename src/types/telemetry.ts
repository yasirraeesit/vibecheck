/**
 * Raw telemetry event emitted by the native SmartSpectra Android SDK bridge.
 */
export interface VitalsUpdateEvent {
  timestamp: number;
  pulseBpm: number;
  breathingRate: number;
  hrvVariance: number;
  faceTension: number;
  confidence: number;
  status: 'calibrating' | 'locked' | 'unstable' | 'lost';
}

/**
 * Enriched biometric telemetry managed by the mobile game state engine.
 */
export interface BiometricTelemetry {
  timestamp: number;
  pulseBpm: number;
  baselineBpm: number;
  bpmDelta: number;
  breathingRate: number;
  breathHoldDetected: boolean;
  hrvVariance: number;
  facialTensionScore: number;
  deceptionProbability: number;
  status: 'calibrating' | 'locked' | 'unstable' | 'lost';
}

/**
 * 5 discrete stages of the party polygraph game flow.
 */
export type GameState = 'consent' | 'calibration' | 'question' | 'interrogation' | 'verdict';

/**
 * Party interrogation question card.
 */
export interface PartyQuestion {
  id: string;
  text: string;
  category: 'spicy' | 'funny' | 'absurd' | 'custom';
}

/**
 * Final polygraph verdict result.
 */
export interface VerdictResult {
  isDeceptive: boolean;
  confidencePercentage: number;
  bpmDelta: number;
  breathHoldDetected: boolean;
  summary: string;
}
