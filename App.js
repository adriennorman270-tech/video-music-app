import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      try {
        const video = await cameraRef.current.recordAsync();
        await MediaLibrary.createAssetAsync(video.uri);
        console.log('Video saved:', video.uri);
      } catch (error) {
        console.warn('Recording failed:', error);
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return <Text>No access to camera or media library</Text>;

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={Camera.Constants.Type.back} />
      <View style={styles.buttonContainer}>
        <Button
          title={isRecording ? "Stop Recording" : "Start Recording"}
          onPress={isRecording ? stopRecording : startRecording}
          color="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
});
