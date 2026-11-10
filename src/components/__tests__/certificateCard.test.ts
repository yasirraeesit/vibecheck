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
    expect(data.watermark).toContain('VIBECHECK POLYGRAPH');
    expect(data.badgeColor).toBe('#FF0055');
  });

  it('formats clean truth certificate when not deceptive', () => {
    const data = formatVerdictCertificateData({
      isDeceptive: false,
      confidencePercentage: 94,
      bpmDelta: 3,
      questionText: 'Do you talk to yourself in foreign accents?',
    });

    expect(data.verdictTitle).toBe('CERTIFIED TRUTHFUL');
    expect(data.deltaLabel).toBe('+3 BPM (STABLE)');
    expect(data.badgeColor).toBe('#00F0FF');
  });
});
