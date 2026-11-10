import React from 'react';

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

export const StyleSheet = {
  create: (styles: any) => styles,
  absoluteFillObject: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

export const View = (props: any) => React.createElement('View', props, props.children);
export const Text = (props: any) => React.createElement('Text', props, props.children);
export const TouchableOpacity = (props: any) => React.createElement('TouchableOpacity', props, props.children);
export const TextInput = (props: any) => React.createElement('TextInput', props, props.children);
export const Image = (props: any) => React.createElement('Image', props, props.children);

export default {
  NativeModules,
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
};
