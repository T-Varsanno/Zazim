import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useFrameProcessor } from 'react-native-vision-camera';
import 'react-native-reanimated';
import { useNavigation } from 'expo-router';

export default function ExerciseCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const devices = useCameraDevice('back');
  const device = devices;
  const navigation = useNavigation();

  // Optional: If you're using a frame processor for extra work:
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // Placeholder for processing each frame
    //console.log('Processing frame...');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // First attempt: Request permission using Vision Camera's API
        const cameraPermission = await Camera.requestCameraPermission();
        console.log("Vision Camera permission result:", cameraPermission);
        if (cameraPermission === 'authorized') {
          setHasPermission(true);
        } else if (Platform.OS === 'android') {
          // If not authorized and on Android, try PermissionsAndroid as fallback
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "This app needs access to your camera to work properly.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          console.log("PermissionsAndroid result:", granted);
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        }
      } catch (error) {
        console.error("Error requesting camera permission:", error);
      }
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera...please</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});