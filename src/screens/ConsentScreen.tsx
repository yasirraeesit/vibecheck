import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

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
  const [permission, requestPermission] = useCameraPermissions();

  const handleProceed = async () => {
    if (simulatorMode) {
      onAccept();
      return;
    }

    if (!permission?.granted) {
      const res = await requestPermission();
      if (res.granted) {
        onAccept();
      }
    } else {
      onAccept();
    }
  };

  const isPermissionDenied = !simulatorMode && permission && !permission.granted && !permission.canAskAgain;

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.cyberBadge}>
          <Text style={styles.cyberBadgeText}>PRESAGE SMARTSPECTRA POWERED</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titlePrefix}>THE PARTY LIE DETECTOR</Text>
        <Text style={styles.titleMain}>VIBECHECK</Text>
        <Text style={styles.titleTagline}>
          Point your phone at a friend, ask spicy questions, and let their heartbeat tell the truth.
        </Text>
      </View>

      <View style={styles.consentCard}>
        <Text style={styles.consentHeader}>HOW THIS WORKS & YOUR PRIVACY</Text>
        <Text style={styles.consentBody}>
          VibeCheck uses your phone's camera and Presage SmartSpectra to detect subtle changes in heart rate, breathing, and expressions in real time.
        </Text>
        <Text style={styles.consentBullet}>
          • 100% on-device — no video or images are ever uploaded or saved online
        </Text>
        <Text style={styles.consentBullet}>
          • Zero accounts or logins needed — completely private
        </Text>
        <Text style={styles.consentBullet}>
          • Just for fun with friends — not a medical or forensic test
        </Text>
      </View>

      <View style={styles.simulatorRow}>
        <Text style={styles.simLabel}>DEV SIMULATOR MODE:</Text>
        <TouchableOpacity
          style={[styles.simButton, simulatorMode ? styles.simActive : styles.simInactive]}
          onPress={() => onToggleSimulator(!simulatorMode)}
        >
          <Text style={styles.simButtonText}>
            {simulatorMode ? 'ON (SIMULATING)' : 'OFF (USING CAMERA)'}
          </Text>
        </TouchableOpacity>
      </View>

      {isPermissionDenied ? (
        <View style={styles.deniedBox}>
          <Text style={styles.deniedText}>
            We need camera access so the app can see your face and read your pulse.
          </Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => Linking.openSettings()}>
            <Text style={styles.settingsBtnText}>OPEN SETTINGS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={handleProceed}>
          <Text style={styles.actionButtonText}>LET'S PLAY</Text>
        </TouchableOpacity>
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
  deniedBox: {
    backgroundColor: 'rgba(255, 0, 85, 0.1)',
    borderColor: '#FF0055',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  deniedText: {
    color: '#FF0055',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  settingsBtn: {
    backgroundColor: '#FF0055',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  settingsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
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
