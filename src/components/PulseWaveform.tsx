import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PulseWaveformProps {
  bpm: number;
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Generates an SVG path data string for a dicrotic pulse plethysmogram wave.
 */
export function generateDicroticWavePath(
  bpm: number,
  width: number,
  height: number,
  phaseOffset: number
): string {
  const points: [number, number][] = [];
  const midY = height * 0.65;
  const amplitude = height * 0.45;
  
  // Wavelength inversely proportional to BPM
  const wavelength = Math.max(40, (60 / Math.max(45, Math.min(180, bpm))) * (width / 3));

  const steps = 60;
  const stepSize = width / steps;

  for (let i = 0; i <= steps; i++) {
    const x = i * stepSize;
    const wavePhase = ((x + phaseOffset) % wavelength) / wavelength;

    let yOffset = 0;
    if (wavePhase < 0.2) {
      // Rapid systolic upstroke
      const t = wavePhase / 0.2;
      yOffset = -Math.sin(t * (Math.PI / 2)) * amplitude;
    } else if (wavePhase < 0.35) {
      // Systolic decline to dicrotic notch
      const t = (wavePhase - 0.2) / 0.15;
      yOffset = -amplitude + t * (amplitude * 0.55);
    } else if (wavePhase < 0.55) {
      // Diastolic secondary wave
      const t = (wavePhase - 0.35) / 0.2;
      const peak = amplitude * 0.3;
      yOffset = -(amplitude * 0.45) - Math.sin(t * Math.PI) * peak;
    } else {
      // Diastolic runoff to baseline
      const t = (wavePhase - 0.55) / 0.45;
      yOffset = -(amplitude * 0.45) * (1 - t);
    }

    points.push([x, midY + yOffset]);
  }

  // Build cubic bezier path string
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const cpX = ((p0[0] + p1[0]) / 2).toFixed(1);
    d += ` C ${cpX} ${p0[1].toFixed(1)}, ${cpX} ${p1[1].toFixed(1)}, ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }

  return d;
}

export const PulseWaveform: React.FC<PulseWaveformProps> = ({
  bpm,
  color = '#00F0FF',
  width = 300,
  height = 80,
}) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 30 FPS update for continuous smooth wave scrolling
    const speed = (bpm / 60) * 8;
    const interval = setInterval(() => {
      setPhase((prev) => (prev + speed) % 10000);
    }, 33);

    return () => clearInterval(interval);
  }, [bpm]);

  const pathData = generateDicroticWavePath(bpm, width, height, phase);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Path
          d={pathData}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});
