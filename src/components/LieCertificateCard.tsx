import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface CertificateInput {
  isDeceptive: boolean;
  confidencePercentage: number;
  bpmDelta: number;
  questionText: string;
}

export function formatVerdictCertificateData(input: CertificateInput) {
  const verdictTitle = input.isDeceptive ? 'DECEPTION DETECTED' : 'CERTIFIED TRUTHFUL';
  const badgeColor = input.isDeceptive ? '#FF0055' : '#00F0FF';
  const deltaLabel = input.bpmDelta >= 0
    ? input.isDeceptive
      ? `+${input.bpmDelta} BPM SPIKE`
      : `+${input.bpmDelta} BPM (STABLE)`
    : `${input.bpmDelta} BPM`;

  return {
    verdictTitle,
    badgeColor,
    deltaLabel,
    confidenceLabel: `${input.confidencePercentage}% CONFIDENCE`,
    watermark: 'VIBECHECK POLYGRAPH // PRESAGE SMARTSPECTRA',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
}

interface LieCertificateCardProps {
  input: CertificateInput;
  onShared?: () => void;
}

export const LieCertificateCard: React.FC<LieCertificateCardProps> = ({ input, onShared }) => {
  const cardRef = useRef<View>(null);
  const data = formatVerdictCertificateData(input);

  const handleShare = async () => {
    try {
      if (cardRef.current) {
        const uri = await captureRef(cardRef.current, {
          format: 'png',
          quality: 0.95,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your VibeCheck polygraph result',
          });
          onShared?.();
          return;
        }
      }
      // Fallback text sharing if image sharing is unavailable
      await Share.share({
        message: `🚨 VIBECHECK POLYGRAPH REPORT 🚨\nVerdict: ${data.verdictTitle} (${data.confidenceLabel})\nQuestion: "${input.questionText}"\nVariation: ${data.deltaLabel}`,
      });
      onShared?.();
    } catch {
      // Safe fallback text share
      try {
        await Share.share({
          message: `🚨 VIBECHECK POLYGRAPH REPORT 🚨\nVerdict: ${data.verdictTitle} (${data.confidenceLabel})\nQuestion: "${input.questionText}"\nVariation: ${data.deltaLabel}`,
        });
        onShared?.();
      } catch {
        // Safe catch
      }
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View ref={cardRef} style={styles.cardFrame} collapsable={false}>
        {/* Certificate Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.headerWatermark}>{data.watermark}</Text>
          <Text style={styles.headerTimestamp}>{data.timestamp}</Text>
        </View>

        {/* Big Verdict Stamp */}
        <View style={[styles.stampContainer, { borderColor: data.badgeColor }]}>
          <Text style={[styles.stampTitle, { color: data.badgeColor }]}>
            {data.verdictTitle}
          </Text>
          <Text style={styles.stampConfidence}>{data.confidenceLabel}</Text>
        </View>

        {/* Question & Interrogation Record */}
        <View style={styles.recordBox}>
          <Text style={styles.recordLabel}>INTERROGATION QUESTION</Text>
          <Text style={styles.recordQuestion}>"{input.questionText}"</Text>
        </View>

        {/* Telemetry Stamps */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>PULSE VARIATION</Text>
            <Text style={[styles.statPillValue, { color: data.badgeColor }]}>{data.deltaLabel}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillLabel}>OPTICAL BIOMETRICS</Text>
            <Text style={styles.statPillValue}>PRESAGE VERIFIED</Text>
          </View>
        </View>

        <Text style={styles.cardFooter}>
          OFFICIAL PARTY INTERROGATION CERTIFICATE • POWERED BY SMARTSPECTRA
        </Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>SHARE TO SOCIAL / SAVE PHOTO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    padding: 16,
  },
  cardFrame: {
    width: 320,
    backgroundColor: '#070A11',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  headerWatermark: {
    color: '#8E9AA8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTimestamp: {
    color: '#8E9AA8',
    fontSize: 8,
    fontWeight: '600',
  },
  stampContainer: {
    borderWidth: 2.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  stampTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  stampConfidence: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 1,
  },
  recordBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  recordLabel: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  recordQuestion: {
    color: '#E0E8F0',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '48%',
  },
  statPillLabel: {
    color: '#8E9AA8',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statPillValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  cardFooter: {
    color: '#4B5563',
    fontSize: 7,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  shareButton: {
    marginTop: 18,
    backgroundColor: '#00F0FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: 320,
  },
  shareButtonText: {
    color: '#0B0F19',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

