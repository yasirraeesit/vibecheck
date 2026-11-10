import * as Haptics from 'expo-haptics';

export interface HapticController {
  pulseHeartbeat: () => Promise<void>;
  triggerAlarmPattern: () => Promise<void>;
  triggerSuccess: () => Promise<void>;
}

export function createHapticController(hapticsApi = Haptics): HapticController {
  return {
    async pulseHeartbeat() {
      try {
        if (hapticsApi?.impactAsync) {
          await hapticsApi.impactAsync(hapticsApi.ImpactFeedbackStyle?.Heavy || ('heavy' as any));
        }
      } catch {
        // Safe fallback on unsupported devices
      }
    },

    async triggerAlarmPattern() {
      try {
        if (hapticsApi?.notificationAsync) {
          await hapticsApi.notificationAsync(
            hapticsApi.NotificationFeedbackType?.Error || ('error' as any)
          );
        }
      } catch {
        // Safe fallback
      }
    },

    async triggerSuccess() {
      try {
        if (hapticsApi?.notificationAsync) {
          await hapticsApi.notificationAsync(
            hapticsApi.NotificationFeedbackType?.Success || ('success' as any)
          );
        }
      } catch {
        // Safe fallback
      }
    },
  };
}

export function useHaptics(): HapticController {
  return createHapticController();
}
