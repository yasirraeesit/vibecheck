import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { BiometricTelemetry } from '../types/telemetry';
import { PulseWaveform } from './PulseWaveform';

interface CameraHudOverlayProps {
  telemetry: BiometricTelemetry;
  targetLocked?: boolean;
  questionText?: string;
}

export function getHudTelemetryStatus(telemetry: BiometricTelemetry) {
  if (telemetry.status === 'lost' || telemetry.pulseBpm === 0) {
    return {
      threatColor: '#8E9AA8',
      statusLabel: 'FACE NOT DETECTED',
    };
  }
  if (telemetry.deceptionProbability >= 0.6) {
    return {
      threatColor: '#FF0055', // Crimson Alarm
      statusLabel: 'HEART RATE SPIKING',
    };
  }
  if (telemetry.deceptionProbability >= 0.4 || telemetry.bpmDelta >= 12) {
    return {
      threatColor: '#FFB800', // Amber Warning
      statusLabel: 'GETTING NERVOUS',
    };
  }
  return {
    threatColor: '#00F0FF', // Neon Cyan Nominal
    statusLabel: 'CALM & STEADY',
  };
}

export const CameraHudOverlay: React.FC<CameraHudOverlayProps> = ({
  telemetry,
  targetLocked = true,
  questionText,
}) => {
  const { threatColor, statusLabel } = getHudTelemetryStatus(telemetry);

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.recContainer}>
          <View style={[styles.recDot, { backgroundColor: threatColor }]} />
          <Text style={styles.recText}>[LIVE SCAN / SMARTSPECTRA]</Text>
        </View>
        <Text style={[styles.statusText, { color: threatColor }]}>
          {statusLabel}
        </Text>
      </View>

      {/* Cybernetic Center Targeting Reticle */}
      <View style={styles.reticleContainer}>
        <Svg width="220" height="240" viewBox="0 0 220 240">
          {/* Top-Left Corner Bracket */}
          <Line x1="10" y1="10" x2="60" y2="10" stroke={threatColor} strokeWidth="3" />
          <Line x1="10" y1="10" x2="10" y2="60" stroke={threatColor} strokeWidth="3" />

          {/* Top-Right Corner Bracket */}
          <Line x1="210" y1="10" x2="160" y2="10" stroke={threatColor} strokeWidth="3" />
          <Line x1="210" y1="10" x2="210" y2="60" stroke={threatColor} strokeWidth="3" />

          {/* Bottom-Left Corner Bracket */}
          <Line x1="10" y1="230" x2="60" y2="230" stroke={threatColor} strokeWidth="3" />
          <Line x1="10" y1="230" x2="10" y2="180" stroke={threatColor} strokeWidth="3" />

          {/* Bottom-Right Corner Bracket */}
          <Line x1="210" y1="230" x2="160" y2="230" stroke={threatColor} strokeWidth="3" />
          <Line x1="210" y1="230" x2="210" y2="180" stroke={threatColor} strokeWidth="3" />

          {/* Center Crosshairs */}
          <Line x1="100" y1="120" x2="120" y2="120" stroke={threatColor} strokeWidth="1.5" />
          <Line x1="110" y1="110" x2="110" y2="130" stroke={threatColor} strokeWidth="1.5" />
        </Svg>
        <Text style={[styles.reticleTag, { color: threatColor }]}>
          {targetLocked ? 'TARGET LOCK // SUSPECT' : 'UNSTABLE // FACE LOST'}
        </Text>
      </View>

      {/* Question Banner if present */}
      {questionText ? (
        <View style={styles.questionBanner}>
          <Text style={styles.questionLabel}>QUESTION</Text>
          <Text style={styles.questionContent}>"{questionText}"</Text>
        </View>
      ) : null}

      {/* Bottom Telemetry HUD */}
      <View style={styles.bottomHud}>
        <View style={styles.telemetryGrid}>
          {/* Heart Rate Metric */}
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>PULSE RATE</Text>
            <Text style={[styles.metricValue, { color: threatColor }]}>
              {telemetry.pulseBpm} <Text style={styles.unitText}>BPM</Text>
            </Text>
            <Text style={styles.deltaText}>
              {telemetry.bpmDelta >= 0 ? `+${telemetry.bpmDelta}` : telemetry.bpmDelta} Δ BASE
            </Text>
          </View>

          {/* Respiration Metric */}
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>RESPIRATION</Text>
            <Text style={styles.metricValue}>
              {telemetry.breathingRate} <Text style={styles.unitText}>RPM</Text>
            </Text>
            <Text style={[styles.deltaText, { color: telemetry.breathHoldDetected ? '#FF0055' : '#8E9AA8' }]}>
              {telemetry.breathHoldDetected ? 'BREATH HELD' : 'STEADY'}
            </Text>
          </View>

          {/* Micro-Tension Metric */}
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>FACIAL TENSION</Text>
            <Text style={[styles.metricValue, { color: threatColor }]}>
              {Math.round(telemetry.facialTensionScore * 100)}%
            </Text>
            <Text style={styles.deltaText}>
              HRV: {telemetry.hrvVariance}ms
            </Text>
          </View>
        </View>

        {/* Live Cardiac Waveform Display */}
        <View style={styles.waveformWrapper}>
          <PulseWaveform bpm={telemetry.pulseBpm} color={threatColor} width={320} height={55} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 36,
  },
  recContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  recText: {
    color: '#E0E8F0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  reticleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleTag: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  questionBanner: {
    backgroundColor: 'rgba(11, 15, 25, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 8,
  },
  questionLabel: {
    color: '#FFB800',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  questionContent: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  bottomHud: {
    backgroundColor: 'rgba(11, 15, 25, 0.90)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricBlock: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#8E9AA8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 11,
    color: '#8E9AA8',
  },
  deltaText: {
    color: '#8E9AA8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  waveformWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
});

