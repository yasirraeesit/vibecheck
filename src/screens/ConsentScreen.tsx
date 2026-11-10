import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConsentScreenProps {
  onAccept: () => void;
  simulatorMode: boolean;
  onToggleSimulator: (val: boolean) => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  onAccept,
  simulatorMode,
  onToggleSimulator,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.cyberBadge}>
          <Text style={styles.cyberBadgeText}>PRESAGE SMARTSPECTRA POWERED</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titlePrefix}>THE CONTACTLESS PARTY POLYGRAPH</Text>
        <Text style={styles.titleMain}>VIBECHECK</Text>
        <Text style={styles.titleTagline}>
          Putting friendships to the biometric test with real-time optical sensing.
        </Text>
      </View>

      <View style={styles.consentCard}>
        <Text style={styles.consentHeader}>PRIVACY & CAMERA CONSENT</Text>
        <Text style={styles.consentBody}>
          VibeCheck uses your device's camera via the Presage SmartSpectra SDK to measure real-time
          pulse, respiration rate, and micro-expressions.
        </Text>
        <Text style={styles.consentBullet}>
          • 100% on-device optical analysis
        </Text>
        <Text style={styles.consentBullet}>
          • Zero cloud biometric storage or video uploading
        </Text>
        <Text style={styles.consentBullet}>
          • For entertainment and party game purposes only
        </Text>
      </View>

      <View style={styles.simulatorRow}>
        <Text style={styles.simLabel}>DEV BIOMETRIC SIMULATOR:</Text>
        <TouchableOpacity
          style={[styles.simButton, simulatorMode ? styles.simActive : styles.simInactive]}
          onPress={() => onToggleSimulator(!simulatorMode)}
        >
          <Text style={styles.simButtonText}>
            {simulatorMode ? 'ON (DEV MODE)' : 'OFF (LIVE CAMERA)'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onAccept}>
        <Text style={styles.actionButtonText}>ACCEPT & ENTER INTERROGATION</Text>
      </TouchableOpacity>
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
  badgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cyberBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: '#00F0FF',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cyberBadgeText: {
    color: '#00F0FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  titlePrefix: {
    color: '#8E9AA8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleMain: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 3,
  },
  titleTagline: {
    color: '#8E9AA8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  consentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  consentHeader: {
    color: '#FFB800',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  consentBody: {
    color: '#E0E8F0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  consentBullet: {
    color: '#8E9AA8',
    fontSize: 12,
    lineHeight: 18,
  },
  simulatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  simLabel: {
    color: '#8E9AA8',
    fontSize: 11,
    fontWeight: '700',
  },
  simButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  simActive: {
    backgroundColor: '#00F0FF',
  },
  simInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  simButtonText: {
    color: '#0B0F19',
    fontSize: 10,
    fontWeight: '800',
  },
  actionButton: {
    backgroundColor: '#00F0FF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  actionButtonText: {
    color: '#0B0F19',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
