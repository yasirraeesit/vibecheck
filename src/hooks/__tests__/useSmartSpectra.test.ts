import { OrganicSimulatorEngine } from '../useSmartSpectra';

describe('OrganicSimulatorEngine', () => {
  it('generates resting biometric telemetry within physiological bounds', () => {
    const simulator = new OrganicSimulatorEngine(72);
    const sample = simulator.tick(0.0); // resting state

    expect(sample.pulseBpm).toBeGreaterThanOrEqual(60);
    expect(sample.pulseBpm).toBeLessThanOrEqual(85);
    expect(sample.breathingRate).toBeGreaterThanOrEqual(12);
    expect(sample.breathingRate).toBeLessThanOrEqual(18);
    expect(sample.faceTension).toBeLessThan(0.3);
    expect(sample.status).toBe('locked');
  });

  it('surges pulse, induces breath hold, and spikes facial tension under high interrogation stimulus', () => {
    const simulator = new OrganicSimulatorEngine(72);
    // Simulate high stress
    const stressedSample = simulator.tick(0.9);

    expect(stressedSample.pulseBpm).toBeGreaterThan(88);
    expect(stressedSample.breathingRate).toBeLessThan(10); // breath hold under pressure
    expect(stressedSample.faceTension).toBeGreaterThan(0.6);
  });

  it('recovers toward baseline when stress stimulus is released', () => {
    const simulator = new OrganicSimulatorEngine(72);
    simulator.tick(0.9); // spike
    simulator.tick(0.9);
    
    // release stress
    const recoveredSample = simulator.tick(0.0);
    expect(recoveredSample.pulseBpm).toBeLessThan(95);
  });
});

