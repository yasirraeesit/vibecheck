export const NativeModules = {
  SmartSpectraModule: undefined,
};

export const DeviceEventEmitter = {
  addListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  emit: jest.fn(),
};

export const Platform = {
  OS: 'android',
  select: (objs: any) => objs.android || objs.default,
};

export default {
  NativeModules,
  DeviceEventEmitter,
  Platform,
};
