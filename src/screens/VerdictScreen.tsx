import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { VerdictResult, PartyQuestion } from '../types/telemetry';

interface VerdictScreenProps {
  verdict: VerdictResult;
  question: PartyQuestion;
  onShareCard: () => void;
  onNextSuspect: () => void;
  onTriggerAlarmSound: () => void;
  onTriggerAlarmHaptics: () => void;
}

export const VerdictScreen: React.FC<VerdictScreenProps> = ({
  verdict,
  question,
  onShareCard,
  onNextSuspect,
  onTriggerAlarmSound,
  onTriggerAlarmHaptics,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRevealed(true);
          if (verdict.isDeceptive) {
            onTriggerAlarmSound();
            onTriggerAlarmHaptics();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const verdictColor = verdict.isDeceptive ? '#FF0055' : '#00F0FF';

  return (
    <View style={styles.container}>
      {!revealed ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.evaluatingText}>ANALYZING AUTONOMIC SIGNALS...</Text>
          <Text style={styles.countdownDigit}>{countdown}</Text>
          <Text style={styles.calculatingSub}>Cross-referencing cardiac surge with facial micro-strain</Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.verdictBadge, { borderColor: verdictColor }]}>
            <Text style={[styles.verdictTitle, { color: verdictColor }]}>
              {verdict.isDeceptive ? 'DECEPTION DETECTED' : 'COLD-BLOODED TRUTH'}
            </Text>
          </View>

          <Text style={styles.confidenceText}>
            CONFIDENCE SCORE: {verdict.confidencePercentage}%
          </Text>

          <View style={styles.detailCard}>
            <Text style={styles.questionStamp}>"{question.text}"</Text>
            <View style={styles.divider} />
            <Text style={styles.summaryText}>{verdict.summary}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>CARDIAC SURGE</Text>
                <Text style={[styles.statValue, { color: verdictColor }]}>
                  {verdict.bpmDelta >= 0 ? `+${verdict.bpmDelta}` : verdict.bpmDelta} BPM
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>RESPIRATION</Text>
                <Text style={styles.statValue}>
                  {verdict.breathHoldDetected ? 'HELD' : 'NORMAL'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: verdictColor }]} onPress={onShareCard}>
            <Text style={styles.shareBtnText}>EXPORT LIE CERTIFICATE CARD</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={onNextSuspect}>
            <Text style={styles.nextBtnText}>INTERROGATE NEXT SUSPECT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    padding: 24,
    justifyContent: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  evaluatingText: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  countdownDigit: {
    color: '#FFFFFF',
    fontSize: 84,
    fontWeight: '900',
    lineHeight: 90,
  },
  calculatingSub: {
    color: '#8E9AA8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  resultContainer: {
    alignItems: 'center',
  },
  verdictBadge: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 8,
  },
  verdictTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  confidenceText: {
    color: '#8E9AA8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  detailCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
  },
  questionStamp: {
    color: '#E0E8F0',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  summaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#8E9AA8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  shareBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  shareBtnText: {
    color: '#0B0F19',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nextBtn: {
    paddingVertical: 12,
  },
  nextBtnText: {
    color: '#8E9AA8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
