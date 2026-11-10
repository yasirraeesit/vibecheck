import React from 'react';

export const CameraView = (props: any) => React.createElement('CameraView', props, props.children);
export const useCameraPermissions = jest.fn(() => [
  { granted: true, canAskAgain: true, status: 'granted' },
  jest.fn().mockResolvedValue({ granted: true }),
]);

export default {
  CameraView,
  useCameraPermissions,
};

