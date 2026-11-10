export const Audio = {
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  Sound: {
    createAsync: jest.fn().mockResolvedValue({
      sound: {
        replayAsync: jest.fn().mockResolvedValue(undefined),
        unloadAsync: jest.fn().mockResolvedValue(undefined),
      },
    }),
  },
};

export default {
  Audio,
};
