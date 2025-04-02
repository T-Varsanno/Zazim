import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as FileSystem from 'expo-file-system';
import { PressableOpacity } from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActivities } from '../../context/ActivitiesContext';

export default function ExerciseCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('front');
  const cameraRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const hasDetectedRef = useRef(false); // 👈 Add detection flag
  const router = useRouter();
  const { activityId } = useLocalSearchParams();
  const { markActivityCompleted } = useActivities();
  const device = useCameraDevice(cameraPermission);

  const onFlipCamera = () => {
    if (isCapturing) {
      stopCapturing();
      setIsCapturing(false);
    }

    setCameraPermission(prev => (prev === 'front' ? 'back' : 'front'));
  };

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'authorized') {
        setHasPermission(true);
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    })();
  }, []);

  const startCapturing = () => {
    if (!cameraRef.current) return;

    hasDetectedRef.current = false; // 👈 Reset detection flag

    captureIntervalRef.current = setInterval(async () => {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
          skipMetadata: true,
        });

        const base64 = await FileSystem.readAsStringAsync(`file://${photo.path}`, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await fetch('http://192.168.1.139:8000/analyze-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        const result = await response.json();
        console.log('📸 Pose result:', result);

        // 👇 Only handle the first successful detection
        if (result.result === 'pose_detected' && !hasDetectedRef.current) {
          hasDetectedRef.current = true;
          stopCapturing();
          Alert.alert('🎉 Success', 'Pose detected!');
          setIsCapturing(false);
          markActivityCompleted(Number(activityId));
          router.push({
            pathname: '/user/activities',
          });
        }
      } catch (err) {
        console.error('Capture or upload error:', err);
      }
    }, 500);
  };

  const stopCapturing = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  };

  const toggleCapture = () => {
    if (isCapturing) {
      stopCapturing();
    } else {
      startCapturing();
    }
    setIsCapturing(prev => !prev);
  };

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
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        {!isCapturing && (
          <PressableOpacity onPress={onFlipCamera} style={styles.flipButton} disabledOpacity={0.4}>
            <IonIcon name="camera-reverse" color="white" size={24} />
          </PressableOpacity>
        )}
        <PressableOpacity onPress={toggleCapture} style={styles.captureButton} disabledOpacity={0.4}>
          <IonIcon name={isCapturing ? 'square' : 'camera'} color="white" size={28} />
        </PressableOpacity>
      </View>
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
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  flipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  captureButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 16,
    borderRadius: 40,
  },
});
