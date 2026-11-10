import { createHapticController } from '../useHaptics';
import { createSoundController } from '../useSoundEffects';

describe('Haptic & Sound Controllers', () => {
  it('exposes haptic trigger methods with graceful mock fallback', async () => {
    const mockHaptics = {
      impactAsync: jest.fn().mockResolvedValue(undefined),
      notificationAsync: jest.fn().mockResolvedValue(undefined),
    };

    const controller = createHapticController(mockHaptics as any);
    await controller.pulseHeartbeat();
    expect(mockHaptics.impactAsync).toHaveBeenCalled();

    await controller.triggerAlarmPattern();
    expect(mockHaptics.notificationAsync).toHaveBeenCalled();
  });

  it('handles sound playback states safely without uncaught promises', async () => {
    const mockSound = {
      replayAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };

    const controller = createSoundController({
      heartbeat: mockSound,
      siren: mockSound,
      chime: mockSound,
    } as any);

    await controller.playHeartbeatThump();
    expect(mockSound.replayAsync).toHaveBeenCalled();

    await controller.playSiren();
    expect(mockSound.replayAsync).toHaveBeenCalled();

    await controller.playChime();
    expect(mockSound.replayAsync).toHaveBeenCalled();
  });
});
