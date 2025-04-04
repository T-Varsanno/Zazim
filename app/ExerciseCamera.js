import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as FileSystem from 'expo-file-system';
import { PressableOpacity } from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActivities } from '../context/ActivitiesContext';

export default function ExerciseCamera() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('front');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const cameraRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const sessionId = useRef(`session-${Date.now()}`);
  const sessionStart = useRef(Date.now());
  const router = useRouter();
  const { activityId } = useLocalSearchParams();
  const { markActivityCompleted } = useActivities();
  const device = useCameraDevice(cameraPermission);

  const onFlipCamera = () => {
    if (isCapturing) {
      stopCapturing();
      setIsCapturing(false);
    }
    setCameraPermission((prev) => (prev === 'front' ? 'back' : 'front'));
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
    sessionStart.current = Date.now();

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

        const timestamp = (Date.now() - sessionStart.current) / 1000;

        await fetch('http://132.73.217.98:8000/upload-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            session_id: sessionId.current,
            timestamp: timestamp,
          }),
        });
      } catch (err) {
        console.error('Upload error:', err);
      }
    }, 200);
  };

  const stopCapturing = async () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    setLoading(true);

    try {
      const res = await fetch('http://132.73.217.98:8000/finish-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId.current }),
      });

      const result = await res.json();
      console.log('🧠 Movement result:', result);

      if (result.result === 'movement_detected') {
        setShowSuccessModal(true);
      } else {
        alert('⚠️ נסה שוב: לא זוהתה התנועה הנכונה');
      }
    } catch (err) {
      console.error('Finish session error:', err);
      alert('❌ שגיאה: קרתה תקלה בסיום הסשן');
    }

    setIsCapturing(false);
    setLoading(false);
  };

  const toggleCapture = () => {
    if (isCapturing) {
      stopCapturing();
    } else {
      sessionId.current = `session-${Date.now()}`;
      sessionStart.current = Date.now();
      startCapturing();
    }
    setIsCapturing((prev) => !prev);
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>מבקש הרשאה למצלמה...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>טוען מצלמה...</Text>
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
          <IonIcon name={isCapturing ? 'square' : 'radio-button-on'} color="white" size={28} />
        </PressableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {showSuccessModal && (
        <View style={styles.successModalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.successText}>הצלחה!</Text>
            <Text style={styles.successSubText}>זוהתה תנועה נכונה 🎯</Text>
            <PressableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                markActivityCompleted(Number(activityId));
                router.push({ pathname: '/' });
              }}
            >
              <Text style={styles.successButtonText}>המשך</Text>
            </PressableOpacity>
          </View>
        </View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  successModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  emoji: {
    fontSize: 40,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4CC9F0',
  },
  successSubText: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: '#4CC9F0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  successButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
