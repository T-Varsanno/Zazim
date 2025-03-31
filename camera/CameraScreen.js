
import { useRef, useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={{ flex: 1 }} type={Camera.Constants.Type.front} />
      <Button title="Capture Frame" onPress={async () => {
        const pic = await cameraRef.current.takePictureAsync({ skipProcessing: true });
        console.log('Captured:', pic.uri);
        // send to MediaPipe here
      }} />
    </View>
  );
}
