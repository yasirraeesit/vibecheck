import { useEffect, useRef } from 'react';

export interface SoundController {
  playHeartbeatThump: () => Promise<void>;
  playSiren: () => Promise<void>;
  playChime: () => Promise<void>;
}

export function createSoundController(soundsMap?: Record<string, any>): SoundController {
  return {
    async playHeartbeatThump() {
      try {
        if (soundsMap?.heartbeat?.play) {
          soundsMap.heartbeat.play();
        } else if (soundsMap?.heartbeat?.replayAsync) {
          await soundsMap.heartbeat.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },

    async playSiren() {
      try {
        if (soundsMap?.siren?.play) {
          soundsMap.siren.play();
        } else if (soundsMap?.siren?.replayAsync) {
          await soundsMap.siren.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },

    async playChime() {
      try {
        if (soundsMap?.chime?.play) {
          soundsMap.chime.play();
        } else if (soundsMap?.chime?.replayAsync) {
          await soundsMap.chime.replayAsync();
        }
      } catch {
        // Safe audio catch
      }
    },
  };
}

export function useSoundEffects(): SoundController {
  const soundsRef = useRef<Record<string, any>>({
    heartbeat: null,
    siren: null,
    chime: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function initAudio() {
      try {
        // Dynamically load expo-audio if available in the current runtime
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const expoAudio = require('expo-audio');
        if (expoAudio?.setIsAudioActiveAsync) {
          await expoAudio.setIsAudioActiveAsync(true);
        }
      } catch {
        // Safe fallback - haptics provide primary physical feedback
      }
    }

    initAudio();

    return () => {
      isMounted = false;
    };
  }, []);

  return createSoundController(soundsRef.current);
}
