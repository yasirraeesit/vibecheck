import { VitalsUpdateEvent, BiometricTelemetry, VerdictResult } from '../types/telemetry';

/**
 * Weights for autonomic stress indicators
 */
const CARDIAC_WEIGHT = 0.45;
const RESPIRATORY_WEIGHT = 0.30;
const FACIAL_TENSION_WEIGHT = 0.25;

const MAX_PULSE_SPIKE_CAP = 25; // BPM delta threshold for full weight
const MIN_PHYSIOLOGICAL_BASELINE = 45;
const MAX_PHYSIOLOGICAL_BASELINE = 130;
const DECEPTION_THRESHOLD = 0.60;

/**
 * Computes deception probability [0.0 - 1.0] from autonomic stress indicators.
 */
export function computeDeceptionScore(
  currentBpm: number,
  baselineBpm: number,
  isBreathHeld: boolean,
  faceTension: number
): number {
  const pulseDelta = Math.max(0, currentBpm - baselineBpm);
  const pulseRatio = Math.min(1.0, pulseDelta / MAX_PULSE_SPIKE_CAP);
  const breathFactor = isBreathHeld ? 1.0 : 0.0;
  const clampedTension = Math.max(0.0, Math.min(1.0, faceTension));

  const rawScore =
    CARDIAC_WEIGHT * pulseRatio +
    RESPIRATORY_WEIGHT * breathFactor +
    FACIAL_TENSION_WEIGHT * clampedTension;

  return Math.min(1.0, Math.max(0.0, Number(rawScore.toFixed(3))));
}

/**
 * Evaluates the final verdict and confidence score.
 */
export function evaluateVerdict(
  score: number,
  bpmDelta: number,
  breathHoldDetected: boolean
): VerdictResult {
  const isDeceptive = score >= DECEPTION_THRESHOLD;
  const rawConfidence = isDeceptive ? score * 100 : (1 - score) * 100;
  const confidencePercentage = Math.min(99, Math.max(50, Math.round(rawConfidence)));

  let summary = isDeceptive
    ? 'DECEPTION DETECTED: Significant autonomic nervous surge recorded.'
    : 'COLD-BLOODED TRUTH: Physiological composure remained rock solid.';

  if (isDeceptive && bpmDelta > 15) {
    summary += ` Pulse surged by +${bpmDelta} BPM.`;
  }
  if (isDeceptive && breathHoldDetected) {
    summary += ' Respiratory arrest / breath-hold detected.';
  }

  return {
    isDeceptive,
    confidencePercentage,
    bpmDelta,
    breathHoldDetected,
    summary,
  };
}

/**
 * PolygraphSession manages calibration, baseline stabilization, and real-time session telemetry.
 */
export class PolygraphSession {
  private calibrationSamples: number[] = [];
  private baselineBpm = 72;

  /**
   * Feeds a heart rate sample during the 5-second calibration window.
   */
  feedCalibrationSample(bpm: number): void {
    if (bpm > 0) {
      this.calibrationSamples.push(bpm);
      const sum = this.calibrationSamples.reduce((a, b) => a + b, 0);
      const avg = sum / this.calibrationSamples.length;
      this.baselineBpm = Math.max(
        MIN_PHYSIOLOGICAL_BASELINE,
        Math.min(MAX_PHYSIOLOGICAL_BASELINE, Math.round(avg))
      );
    }
  }

  getBaselineBpm(): number {
    return this.baselineBpm;
  }

  resetCalibration(): void {
    this.calibrationSamples = [];
    this.baselineBpm = 72;
  }

  /**
   * Processes a real-time vitals update from SmartSpectra and enriches with game telemetry.
   */
  processVitalsSample(event: VitalsUpdateEvent): BiometricTelemetry {
    // A breathing rate under 10 breaths/min during interrogation signals sudden breath-hold / hesitation
    const breathHoldDetected = event.breathingRate > 0 && event.breathingRate < 10;
    const bpmDelta = Math.round(event.pulseBpm - this.baselineBpm);

    const deceptionProbability = computeDeceptionScore(
      event.pulseBpm,
      this.baselineBpm,
      breathHoldDetected,
      event.faceTension
    );

    return {
      timestamp: event.timestamp,
      pulseBpm: Math.round(event.pulseBpm),
      baselineBpm: this.baselineBpm,
      bpmDelta,
      breathingRate: Number(event.breathingRate.toFixed(1)),
      breathHoldDetected,
      hrvVariance: Math.round(event.hrvVariance),
      facialTensionScore: Number(event.faceTension.toFixed(2)),
      deceptionProbability,
      status: event.status,
    };
  }
}
