import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BiometricTelemetry } from '../types/telemetry';
import { CameraHudOverlay } from '../components/CameraHudOverlay';

interface CalibrationScreenProps {
  telemetry: BiometricTelemetry;
  onCalibrationComplete: () => void;
  onFeedSample: (bpm: number) => void;
}

export const CalibrationScreen: React.FC<CalibrationScreenProps> = ({
  telemetry,
  onCalibrationComplete,
  onFeedSample,
}) => {
  const [countdown, setCountdown] = useState(5);

  // Continuously feed samples as pulse updates during calibration window
  useEffect(() => {
    if (telemetry.pulseBpm > 0) {
      onFeedSample(telemetry.pulseBpm);
    }
  }, [telemetry.pulseBpm, onFeedSample]);

  // 5-second countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCalibrationComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onCalibrationComplete]);

  const targetLocked = telemetry.status === 'locked' && telemetry.pulseBpm > 0;

  return (
    <View style={styles.container}>
      <CameraHudOverlay telemetry={telemetry} targetLocked={targetLocked} />

      <View style={styles.floatingCenterCard}>
        <Text style={styles.calibHeader}>STAY STILL</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.calibSub}>
          Keep your face in the box and breathe normally while we get your resting heartbeat.
        </Text>
        <Text style={styles.liveBpmText}>
          {telemetry.pulseBpm > 0 ? `CURRENT PULSE: ${telemetry.pulseBpm} BPM` : 'LOCKING ONTO FACE...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  floatingCenterCard: {
    position: 'absolute',
    top: '38%',
    left: 24,
    right: 24,
    backgroundColor: 'rgba(11, 15, 25, 0.92)',
    borderColor: '#00F0FF',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  calibHeader: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  countdownNumber: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '900',
    lineHeight: 70,
  },
  calibSub: {
    color: '#8E9AA8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
  },
  liveBpmText: {
    color: '#00F0FF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
    letterSpacing: 1,
  },
});
