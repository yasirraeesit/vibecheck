import { computeDeceptionScore, evaluateVerdict, PolygraphSession } from '../polygraphEngine';

describe('polygraphEngine', () => {
  describe('computeDeceptionScore', () => {
    it('calculates low deception probability for calm baseline vitals', () => {
      const score = computeDeceptionScore(72, 70, false, 0.1);
      expect(score).toBeLessThan(0.4);
      const verdict = evaluateVerdict(score, 2, false);
      expect(verdict.isDeceptive).toBe(false);
      expect(verdict.summary).toContain('TRUTH');
    });

    it('triggers high deception probability on significant cardiac surge and breath hold', () => {
      const score = computeDeceptionScore(102, 72, true, 0.8);
      expect(score).toBeGreaterThanOrEqual(0.6);
      const verdict = evaluateVerdict(score, 30, true);
      expect(verdict.isDeceptive).toBe(true);
      expect(verdict.confidencePercentage).toBeGreaterThanOrEqual(60);
      expect(verdict.summary).toContain('DECEPTION');
    });

    it('clamps pulse delta ratio at 1.0 when BPM spikes more than 25 over baseline', () => {
      const scoreMax = computeDeceptionScore(140, 70, false, 0); // delta = 70, clamped at 25
      const score25 = computeDeceptionScore(95, 70, false, 0);   // delta = 25
      expect(scoreMax).toBeCloseTo(score25);
      expect(scoreMax).toBeCloseTo(0.45);
    });
  });

  describe('PolygraphSession calibration', () => {
    it('computes rolling average baseline during calibration window', () => {
      const session = new PolygraphSession();
      session.feedCalibrationSample(75);
      session.feedCalibrationSample(78);
      session.feedCalibrationSample(72);
      expect(session.getBaselineBpm()).toBeCloseTo(75, 0);
    });

    it('clamps baseline within physiological bounds (45 <= BPM <= 130)', () => {
      const lowSession = new PolygraphSession();
      lowSession.feedCalibrationSample(30);
      expect(lowSession.getBaselineBpm()).toBe(45);

      const highSession = new PolygraphSession();
      highSession.feedCalibrationSample(180);
      expect(highSession.getBaselineBpm()).toBe(130);
    });

    it('tracks interrogation live telemetry correctly', () => {
      const session = new PolygraphSession();
      session.feedCalibrationSample(70);
      session.feedCalibrationSample(70);
      
      const telemetry = session.processVitalsSample({
        timestamp: Date.now(),
        pulseBpm: 92,
        breathingRate: 8,
        hrvVariance: 28,
        faceTension: 0.7,
        confidence: 0.9,
        status: 'locked',
      });

      expect(telemetry.baselineBpm).toBe(70);
      expect(telemetry.bpmDelta).toBe(22);
      expect(telemetry.breathHoldDetected).toBe(true); // < 10 breaths/min indicates breath hold / arrest
      expect(telemetry.deceptionProbability).toBeGreaterThan(0.5);
    });
  });
});

