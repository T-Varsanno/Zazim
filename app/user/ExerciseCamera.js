import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as FileSystem from 'expo-file-system';
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useActivities } from '../../context/ActivitiesContext';

export default function ExerciseCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission,setCameraPossition] = useState('front')
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { activityId } = useLocalSearchParams(); // get passed activity ID
  const { markActivityCompleted } = useActivities();
  const device = useCameraDevice(cameraPermission);

  const onFlipCamera =()=>{
    cameraPermission==='front'?
    setCameraPossition('back'):
    setCameraPossition('front')
  }


  // Request camera permissions
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission === 'authorized') {
        setHasPermission(true);
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    })();
  }, []);

  // Frame capturing logic
  useEffect(() => {
    let interval;

    if (hasPermission && device && !isCapturing) {
      setIsCapturing(true);

      interval = setInterval(async () => {
        try {
          if (cameraRef.current) {
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

            if (result.result === 'pose_detected') {
              clearInterval(interval);
              Alert.alert('🎉 Success', 'Pose detected!');
              markActivityCompleted(Number(activityId)); // Mark complete
              navigation.goBack(); // Go back to activities
            }
          }
        } catch (err) {
          console.error('Capture or upload error:', err);
        }
      }, 500); // Send 2 per second
    }

    return () => clearInterval(interval);
  }, [hasPermission, device]);

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
        <PressableOpacity onPress={onFlipCamera} style={styles.flipButton} disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
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
    right: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
