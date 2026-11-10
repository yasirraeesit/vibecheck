import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export interface SoundController {
  playHeartbeatThump: () => Promise<void>;
  playSiren: () => Promise<void>;
  playChime: () => Promise<void>;
}

export function createSoundController(soundsMap?: Record<string, any>): SoundController {
  return {
    async playHeartbeatThump() {
      try {
        if (soundsMap?.heartbeat?.replayAsync) {
          await soundsMap.heartbeat.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },

    async playSiren() {
      try {
        if (soundsMap?.siren?.replayAsync) {
          await soundsMap.siren.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },

    async playChime() {
      try {
        if (soundsMap?.chime?.replayAsync) {
          await soundsMap.chime.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },
  };
}

export function useSoundEffects(): SoundController {
  const soundsRef = useRef<Record<string, Audio.Sound | null>>({
    heartbeat: null,
    siren: null,
    chime: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSounds() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        // Synthetic or asset sound hooks can be loaded here
      } catch {
        // Audio mode setup safe catch
      }
    }

    loadSounds();

    return () => {
      isMounted = false;
      Object.values(soundsRef.current).forEach((sound) => {
        sound?.unloadAsync().catch(() => {});
      });
    };
  }, []);

  return createSoundController(soundsRef.current);
}
