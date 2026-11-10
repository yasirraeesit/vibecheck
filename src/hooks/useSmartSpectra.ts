import { useState, useEffect, useRef, useCallback } from 'react';
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { BiometricTelemetry, VitalsUpdateEvent } from '../types/telemetry';
import { PolygraphSession } from '../utils/polygraphEngine';

/**
 * High-fidelity physiological oscillator modeling autonomic stress response.
 */
export class OrganicSimulatorEngine {
  private baselineBpm: number;
  private currentBpm: number;
  private breathRate: number;
  private phase: number = 0;

  constructor(baselineBpm: number = 72) {
    this.baselineBpm = baselineBpm;
    this.currentBpm = baselineBpm;
    this.breathRate = 15;
  }

  public tick(stimulus: number = 0.0): VitalsUpdateEvent {
    this.phase += 0.2;
    // Sinus arrhythmia oscillation (+- 2 BPM naturally)
    const naturalOscillation = Math.sin(this.phase) * 2.2;
    
    // Stress surge target
    const stressSurge = stimulus * 32.0;
    const targetBpm = this.baselineBpm + naturalOscillation + stressSurge;
    
    // Smooth physiological slew rate (faster surge under high interrogation stress)
    const slewRate = stimulus > 0.5 ? 0.65 : 0.35;
    this.currentBpm += (targetBpm - this.currentBpm) * slewRate;

    // Breathing: Under acute stress, respiration either arrests (breath hold) or hyperventilates
    if (stimulus > 0.5) {
      // Breath hold apnea under pressure
      this.breathRate = Math.max(0, 7.5 - stimulus * 4.0);
    } else {
      // Resting rhythmic breathing
      this.breathRate = 14.5 + Math.sin(this.phase * 0.4) * 1.5;
    }

    const faceTension = Math.min(1.0, Math.max(0.08, stimulus * 0.85 + Math.abs(Math.sin(this.phase * 0.8)) * 0.1));
    const hrvVariance = Math.max(15, 45 - stimulus * 25);

    return {
      timestamp: Date.now(),
      pulseBpm: Math.round(this.currentBpm),
      breathingRate: Number(this.breathRate.toFixed(1)),
      hrvVariance: Math.round(hrvVariance),
      faceTension: Number(faceTension.toFixed(2)),
      confidence: 0.96,
      status: 'locked',
    };
  }
}

interface UseSmartSpectraOptions {
  simulatorMode?: boolean;
  initialBaseline?: number;
}

export function useSmartSpectra(options: UseSmartSpectraOptions = {}) {
  const { simulatorMode = false, initialBaseline = 72 } = options;
  const sessionRef = useRef<PolygraphSession>(new PolygraphSession());
  const simulatorRef = useRef<OrganicSimulatorEngine>(new OrganicSimulatorEngine(initialBaseline));
  const stimulusRef = useRef<number>(0.0);

  const isNativeAvailable = Boolean(NativeModules && NativeModules.SmartSpectraModule);
  const useSimulator = simulatorMode || !isNativeAvailable;

  const [telemetry, setTelemetry] = useState<BiometricTelemetry>({
    timestamp: Date.now(),
    pulseBpm: initialBaseline,
    baselineBpm: initialBaseline,
    bpmDelta: 0,
    breathingRate: 15,
    breathHoldDetected: false,
    hrvVariance: 40,
    facialTensionScore: 0.1,
    deceptionProbability: 0.1,
    status: 'calibrating',
  });

  const [isConnected, setIsConnected] = useState<boolean>(true);

  const setStimulus = useCallback((stressLevel: number) => {
    stimulusRef.current = Math.max(0, Math.min(1, stressLevel));
  }, []);

  const resetCalibration = useCallback(() => {
    sessionRef.current.resetCalibration();
  }, []);

  const feedCalibration = useCallback((bpm: number) => {
    sessionRef.current.feedCalibrationSample(bpm);
  }, []);

  useEffect(() => {
    if (useSimulator) {
      // 250ms update cycle (4Hz)
      const interval = setInterval(() => {
        const rawEvent = simulatorRef.current.tick(stimulusRef.current);
        const enriched = sessionRef.current.processVitalsSample(rawEvent);
        setTelemetry(enriched);
      }, 250);

      return () => clearInterval(interval);
    } else {
      // Native Android SmartSpectraModule event subscription
      const subscription = DeviceEventEmitter.addListener(
        'onVitalsUpdate',
        (event: VitalsUpdateEvent) => {
          const enriched = sessionRef.current.processVitalsSample(event);
          setTelemetry(enriched);
        }
      );

      return () => {
        subscription.remove();
      };
    }
  }, [useSimulator]);

  return {
    telemetry,
    isConnected,
    isNativeSdk: isNativeAvailable && !simulatorMode,
    setStimulus,
    resetCalibration,
    feedCalibration,
  };
}
