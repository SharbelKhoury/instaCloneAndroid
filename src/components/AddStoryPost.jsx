import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text, StatusBar, Image, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import MediaStorage from '../utils/MediaStorage';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';

export default function AddStoryPost() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flash, setFlash] = useState('off');
  const [cameraPosition, setCameraPosition] = useState('back');
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const navigation = useNavigation();
  const timerRef = useRef(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setPermissionError(null);
        const cameraPermission = await Camera.requestCameraPermission();
        setHasCameraPermission(cameraPermission === 'authorized');
      } catch (err) {
        setHasCameraPermission(false);
        setPermissionError('An error occurred while requesting camera permission.');
      }
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({ flash });
        // Save photo to app's assets folder
        const fileName = `photo_${Date.now()}.jpg`;
        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        await RNFS.copyFile(photo.path, destPath);
        // Upload the local file path to Firestore
        const photoDoc = await firestore().collection('photos').add({
          path: destPath,
          createdAt: new Date(),
        });
        // Optionally, you can also save to MediaStorage if you want
        await MediaStorage.saveMedia(destPath, 'photo');
      } catch (e) {
        setPermissionError('Failed to take photo.');
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      try {
        const video = await cameraRef.current.startRecording({
          flash,
          onRecordingFinished: async (video) => {
            await MediaStorage.saveMedia(video.path, 'video');
            stopRecording();
          },
          onRecordingError: (error) => {
            setPermissionError('Failed to record video.');
            stopRecording();
          },
        });
      } catch (e) {
        setPermissionError('Failed to start recording.');
        stopRecording();
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };

  const switchCamera = () => {
    setCameraPosition(cameraPosition === 'back' ? 'front' : 'back');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function requestCameraPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS will prompt automatically
    return true;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasCameraPermission === null && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white' }}>Requesting camera permission...</Text>
        </View>
      )}
      {hasCameraPermission === false && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
          <Text style={{ color: 'white', marginBottom: 16 }}>
            {permissionError ? permissionError : 'Camera permission denied. Please enable it in settings.'}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }}
            onPress={async () => {
              try {
                setPermissionError(null);
                const granted = await requestCameraPermission();
                setHasCameraPermission(granted);
              } catch (err) {
                setHasCameraPermission(false);
                setPermissionError('An error occurred while requesting camera permission.');
              }
            }}
          >
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {hasCameraPermission === true && device && (
        <Camera
          ref={cameraRef}
          style={styles.preview}
          device={device}
          isActive={true}
          photo={true}
          video={true}
          audio={true}
          flash={flash}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
              <Image
                source={flash === 'on'
                  ? require('../assets/flash-on.png')
                  : require('../assets/flash-off.png')}
                style={{ width: 30, height: 30, tintColor: 'white' }}
              />
            </TouchableOpacity>
            {isRecording && (
              <View style={styles.recordingTimeContainer}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              </View>
            )}
            <TouchableOpacity onPress={switchCamera} style={styles.iconButton}>
              <Image
                source={require('../assets/flip-camera.png')}
                style={{ width: 30, height: 30, tintColor: 'white' }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={takePicture}
              onLongPress={startRecording}
              onPressOut={stopRecording}
              style={styles.captureButton}
              activeOpacity={0.7}
            >
              <View style={[styles.innerButton, isRecording && styles.recordingButton]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={() => navigation.navigate('Gallery')}
            >
              <Text style={styles.galleryButtonText}>↑</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  recordingButton: {
    backgroundColor: 'red',
  },
  recordingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 30,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 5,
  },
  recordingTime: {
    color: 'white',
    fontSize: 14,
  },
  galleryButton: {
    position: 'absolute',
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});