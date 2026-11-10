import { VitalsUpdateEvent, BiometricTelemetry, GameState, PartyQuestion, VerdictResult } from '../telemetry';

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

  it('validates a complete BiometricTelemetry contract with composite scoring', () => {
    const telemetry: BiometricTelemetry = {
      timestamp: Date.now(),
      pulseBpm: 88,
      baselineBpm: 72,
      bpmDelta: 16,
      breathingRate: 14,
      breathHoldDetected: true,
      hrvVariance: 35,
      facialTensionScore: 0.65,
      deceptionProbability: 0.78,
      status: 'locked',
    };
    expect(telemetry.bpmDelta).toBe(16);
    expect(telemetry.deceptionProbability).toBeCloseTo(0.78);
  });

  it('validates game state progression literals', () => {
    const states: GameState[] = ['consent', 'calibration', 'question', 'interrogation', 'verdict'];
    expect(states).toHaveLength(5);
  });

  it('validates party question structure', () => {
    const question: PartyQuestion = {
      id: 'q1',
      text: 'Did you secretly eat the last donut?',
      category: 'spicy',
    };
    expect(question.text).toBeTruthy();
    expect(question.category).toBe('spicy');
  });

  it('validates verdict result structure', () => {
    const verdict: VerdictResult = {
      isDeceptive: true,
      confidencePercentage: 85,
      bpmDelta: 18,
      breathHoldDetected: true,
      summary: 'Deception detected with high confidence',
    };
    expect(verdict.isDeceptive).toBe(true);
    expect(verdict.confidencePercentage).toBe(85);
  });
});

