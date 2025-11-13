import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MediaStorage from '../utils/MediaStorage';

export default function GalleryScreen() {
  const [media, setMedia] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadMedia = async () => {
      const savedMedia = await MediaStorage.getMedia();
      setMedia(savedMedia.reverse());
    };
    
    loadMedia();
    const unsubscribe = navigation.addListener('focus', loadMedia);
    
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaContainer}
      onPress={() => navigation.navigate('MediaView', { uri: item.uri, type: item.type })}
    >
      <Image source={{ uri: item.uri }} style={styles.media} />
      {item.type === 'video' && (
        <View style={styles.videoIndicator}>
          <Image
            source={require('../assets/play-arrow.png')}
            style={{ width: 30, height: 30, tintColor: 'white' }}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')} style={styles.backButton}>
          <Image
            source={require('../assets/arrow-downward.png')}
            style={{ width: 30, height: 30, tintColor: 'white' }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Gallery</Text>
      </View>

      <FlatList
        data={media}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.gallery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gallery: {
    paddingBottom: 20,
  },
  mediaContainer: {
    flex: 1,
    margin: 1,
    aspectRatio: 1,
  },
  media: {
    flex: 1,
  },
  videoIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});