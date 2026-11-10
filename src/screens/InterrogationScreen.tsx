import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { BiometricTelemetry, PartyQuestion } from '../types/telemetry';
import { CameraHudOverlay } from '../components/CameraHudOverlay';

interface InterrogationScreenProps {
  telemetry: BiometricTelemetry;
  activeQuestion: PartyQuestion;
  onNextQuestion: () => void;
  onAddCustomQuestion: (text: string) => void;
  onLockInVerdict: () => void;
  onApplyStressStimulus: (level: number) => void;
}

export const InterrogationScreen: React.FC<InterrogationScreenProps> = ({
  telemetry,
  activeQuestion,
  onNextQuestion,
  onAddCustomQuestion,
  onLockInVerdict,
  onApplyStressStimulus,
}) => {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onAddCustomQuestion(customText.trim());
      setCustomText('');
      setShowCustomInput(false);
      onNextQuestion();
    }
  };

  const targetLocked = telemetry.status === 'locked' && telemetry.pulseBpm > 0;

  return (
    <View style={styles.container}>
      <CameraHudOverlay
        telemetry={telemetry}
        targetLocked={targetLocked}
        questionText={activeQuestion.text}
      />

      {/* Floating Control Tray */}
      <View style={styles.controlTray}>
        <View style={styles.questionNavRow}>
          <TouchableOpacity
            style={styles.pillBtn}
            onPress={() => {
              onApplyStressStimulus(0.0);
              onNextQuestion();
            }}
          >
            <Text style={styles.pillBtnText}>NEXT CARD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillBtn, styles.pillHighlight]}
            onPress={() => setShowCustomInput(!showCustomInput)}
          >
            <Text style={styles.pillHighlightText}>+ WRITE YOUR OWN</Text>
          </TouchableOpacity>

          {/* Simulate stress button for demoing */}
          <TouchableOpacity
            style={[styles.pillBtn, styles.pillSpike]}
            onPress={() => onApplyStressStimulus(0.85)}
          >
            <Text style={styles.pillSpikeText}>SPIKE VITALS</Text>
          </TouchableOpacity>
        </View>

        {showCustomInput && (
          <View style={styles.customInputBox}>
            <TextInput
              style={styles.inputField}
              placeholder="Type your own question..."
              placeholderTextColor="#8E9AA8"
              value={customText}
              onChangeText={setCustomText}
            />
            <TouchableOpacity style={styles.inputSubmitBtn} onPress={handleCustomSubmit}>
              <Text style={styles.inputSubmitText}>ASK</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.verdictBtn} onPress={onLockInVerdict}>
          <Text style={styles.verdictBtnText}>LOCK IN ANSWER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  controlTray: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  questionNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pillBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillBtnText: {
    color: '#E0E8F0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pillHighlight: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: '#00F0FF',
    borderWidth: 1,
  },
  pillHighlightText: {
    color: '#00F0FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pillSpike: {
    backgroundColor: 'rgba(255, 0, 85, 0.2)',
    borderColor: '#FF0055',
    borderWidth: 1,
  },
  pillSpikeText: {
    color: '#FF0055',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  customInputBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
  },
  inputField: {
    flex: 1,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 13,
  },
  inputSubmitBtn: {
    backgroundColor: '#00F0FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputSubmitText: {
    color: '#0B0F19',
    fontWeight: '900',
    fontSize: 11,
  },
  verdictBtn: {
    backgroundColor: '#FF0055',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#FF0055',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  verdictBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

