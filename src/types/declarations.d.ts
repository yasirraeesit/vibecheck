declare module 'expo-camera' {
  export const CameraView: any;
  export function useCameraPermissions(): [any, () => Promise<any>];
}

declare module 'react-native-view-shot' {
  export function captureRef(viewRef: any, options?: any): Promise<string>;
}

