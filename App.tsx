import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView } from 'expo-camera';
import { GameState, PartyQuestion, VerdictResult } from './src/types/telemetry';
import { useSmartSpectra } from './src/hooks/useSmartSpectra';
import { useHaptics } from './src/hooks/useHaptics';
import { useSoundEffects } from './src/hooks/useSoundEffects';
import { QuestionDeck } from './src/utils/questionDeck';
import { evaluateVerdict } from './src/utils/polygraphEngine';
import { ConsentScreen } from './src/screens/ConsentScreen';
import { CalibrationScreen } from './src/screens/CalibrationScreen';
import { InterrogationScreen } from './src/screens/InterrogationScreen';
import { VerdictScreen } from './src/screens/VerdictScreen';
import { LieCertificateCard } from './src/components/LieCertificateCard';

export default function App() {
  const [simulatorMode, setSimulatorMode] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>('consent');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const deckRef = useRef<QuestionDeck>(new QuestionDeck());
  const [activeQuestion, setActiveQuestion] = useState<PartyQuestion>(() =>
    deckRef.current.drawNext()
  );

  const {
    telemetry,
    setStimulus,
    resetCalibration,
    feedCalibration,
  } = useSmartSpectra({ simulatorMode });

  const haptics = useHaptics();
  const sounds = useSoundEffects();

  const [currentVerdict, setCurrentVerdict] = useState<VerdictResult>({
    isDeceptive: false,
    confidencePercentage: 92,
    bpmDelta: 2,
    breathHoldDetected: false,
    summary: 'Resting composure maintained.',
  });

  const handleNextQuestion = () => {
    setActiveQuestion(deckRef.current.drawNext());
  };

  const handleAddCustomQuestion = (text: string) => {
    deckRef.current.addCustomQuestion(text);
  };

  const handleLockInVerdict = () => {
    const verdict = evaluateVerdict(
      telemetry.deceptionProbability,
      telemetry.bpmDelta,
      telemetry.breathHoldDetected
    );
    setCurrentVerdict(verdict);
    setGameState('verdict');
  };

  const handleNextSuspect = () => {
    resetCalibration();
    setStimulus(0.0);
    setActiveQuestion(deckRef.current.drawNext());
    setShowCertificateModal(false);
    setGameState('calibration');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* When live camera mode is active, render CameraView beneath HUD */}
      {!simulatorMode && (gameState === 'calibration' || gameState === 'interrogation') && (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      )}

      {gameState === 'consent' && (
        <ConsentScreen
          onAccept={() => setGameState('calibration')}
          simulatorMode={simulatorMode}
          onToggleSimulator={setSimulatorMode}
        />
      )}

      {gameState === 'calibration' && (
        <CalibrationScreen
          telemetry={telemetry}
          onFeedSample={feedCalibration}
          onCalibrationComplete={() => setGameState('interrogation')}
        />
      )}

      {(gameState === 'question' || gameState === 'interrogation') && (
        <InterrogationScreen
          telemetry={telemetry}
          activeQuestion={activeQuestion}
          onNextQuestion={handleNextQuestion}
          onAddCustomQuestion={handleAddCustomQuestion}
          onLockInVerdict={handleLockInVerdict}
          onApplyStressStimulus={setStimulus}
        />
      )}

      {gameState === 'verdict' && (
        <VerdictScreen
          verdict={currentVerdict}
          question={activeQuestion}
          onShareCard={() => setShowCertificateModal(true)}
          onNextSuspect={handleNextSuspect}
          onTriggerAlarmSound={sounds.playSiren}
          onTriggerAlarmHaptics={haptics.triggerAlarmPattern}
        />
      )}

      {/* Shareable Mugshot / Lie Certificate Modal */}
      <Modal
        visible={showCertificateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCertificateModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <LieCertificateCard
            input={{
              isDeceptive: currentVerdict.isDeceptive,
              confidencePercentage: currentVerdict.confidencePercentage,
              bpmDelta: currentVerdict.bpmDelta,
              questionText: activeQuestion.text,
            }}
            onShared={() => setShowCertificateModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
