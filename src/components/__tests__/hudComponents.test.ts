import { generateDicroticWavePath } from '../PulseWaveform';
import { getHudTelemetryStatus } from '../CameraHudOverlay';

describe('PulseWaveform & CameraHudOverlay logic', () => {
  it('generates an SVG path string containing coordinates and cubic beziers', () => {
    const path = generateDicroticWavePath(80, 300, 100, 0);
    expect(path).toMatch(/^M\s*0/);
    expect(path).toContain('C');
    expect(path.length).toBeGreaterThan(50);
  });

  it('formats telemetry badge states according to threat/deception probability', () => {
    const calmStatus = getHudTelemetryStatus({
      timestamp: Date.now(),
      pulseBpm: 72,
      baselineBpm: 70,
      bpmDelta: 2,
      breathingRate: 15,
      breathHoldDetected: false,
      hrvVariance: 42,
      facialTensionScore: 0.15,
      deceptionProbability: 0.2,
      status: 'locked',
    });

    expect(calmStatus.threatColor).toBe('#00F0FF'); // Neon Cyan
    expect(calmStatus.statusLabel).toBe('CALM & STEADY');

    const spikeStatus = getHudTelemetryStatus({
      timestamp: Date.now(),
      pulseBpm: 104,
      baselineBpm: 72,
      bpmDelta: 32,
      breathingRate: 6,
      breathHoldDetected: true,
      hrvVariance: 18,
      facialTensionScore: 0.85,
      deceptionProbability: 0.82,
      status: 'locked',
    });

    expect(spikeStatus.threatColor).toBe('#FF0055'); // Crimson Warning
    expect(spikeStatus.statusLabel).toBe('HEART RATE SPIKING');

    const lostStatus = getHudTelemetryStatus({
      timestamp: Date.now(),
      pulseBpm: 0,
      baselineBpm: 72,
      bpmDelta: 0,
      breathingRate: 0,
      breathHoldDetected: false,
      hrvVariance: 0,
      facialTensionScore: 0,
      deceptionProbability: 0,
      status: 'lost',
    });

    expect(lostStatus.threatColor).toBe('#8E9AA8');
    expect(lostStatus.statusLabel).toBe('FACE NOT DETECTED');
  });

  it('renders flatline path when pulse is zero', () => {
    const flatPath = generateDicroticWavePath(0, 300, 100, 0);
    expect(flatPath).toBe('M 0 65.0 L 300.0 65.0');
  });
});

