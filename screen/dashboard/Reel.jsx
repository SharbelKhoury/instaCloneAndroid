// ReelsComponent.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Video from 'react-native-video';
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

/* import { reelsData } from '../../src/utils/UserData'; */
function getImageSource(image) {
  if (!image) return null;
  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return { uri: image };
  }
  if (typeof image === "string" && localImages[image]) {
    return localImages[image];
  }
  return null;
}

const localImages = {
  '../../src/assets/reels/reel1.mp4' : require('../../src/assets/reels/reel1.mp4'),
  '../../src/assets/reels/reel2.mp4' : require('../../src/assets/reels/reel2.mp4'),
  '../../src/assets/reels/reel3.mp4' : require('../../src/assets/reels/reel3.mp4'),
  '../../src/assets/reels/reel4.mp4' : require('../../src/assets/reels/reel4.mp4'),
  '../../src/assets/reels/reel5.mp4' : require('../../src/assets/reels/reel5.mp4'),
  '../../src/assets/reels/reel6.mp4' : require('../../src/assets/reels/reel6.mp4'),
  '../../src/assets/reels/reel7.mp4' : require('../../src/assets/reels/reel7.mp4'),
};

const { height, width } = Dimensions.get('window');

const Reel = () => {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const reelsCol = collection(db, 'reels');
        const reelSnapshot = await getDocs(reelsCol);
        const reelsList = reelSnapshot.docs.map(doc => doc.data());
        console.log('Fetched reels:', reelsList); // Debug log
        setReels(reelsList);
      } catch (error) {
        console.error('Error fetching reels from Firestore:', error);
      } finally {
        //setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [paused, setPaused] = useState(false); // Add paused state
  const videoRefs = useRef([]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const currentItem = viewableItems[0];
      if (currentItem) {
        setCurrentIndex(currentItem.index);
        // Optionally, reset the new current video to start
        // if (videoRefs.current[currentItem.index]) {
        //   videoRefs.current[currentItem.index].seek(0);
        // }
      }
    }
  }).current;

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = (id) => {
    console.log(`Toggled like for reel ${id}`);
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.videoContainer} onPress={() => setPaused(prev => !prev)}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: getImageSource(item.videoUrl) }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={paused}
          muted={isMuted}
          onBuffer={() => setIsBuffering(true)}
          onReadyForDisplay={() => setIsBuffering(false)}
          onError={(error) => console.error('Video error:', error)}
        />
        
        {isBuffering && index === currentIndex && (
          <ActivityIndicator size="large" color="#fff" style={styles.bufferingIndicator} />
        )}

        {/* Gradient overlay for better text visibility */}
        <View style={styles.gradientOverlay} />
        
        <View style={styles.bottomSection}>
          {/* Left side - User info and caption */}
          <View style={styles.leftSection}>
            
            <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => {}}><Image source={{ uri: item.userImage }} style={styles.userImage} /></TouchableOpacity>
            <TouchableOpacity onPress={() => {}}><Text style={styles.username}>@{item.username}</Text></TouchableOpacity>
            </View>
            
            <Text style={styles.caption}>{item.caption}</Text>
            
            <View style={styles.musicContainer}>
              <Image
                source={require('../../src/assets/music_note.png')}
                style={styles.musicIcon}
              />
              <Text style={styles.musicName}>{item.musicName}</Text>
            </View>
          </View>

          {/* Right side - Action buttons */}
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={item.isLiked 
                  ? require('../../src/assets/heart-filled.png') 
                  : require('../../src/assets/heart-outline.png')}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionCount, {}]}>{item.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require('../../src/assets/Comment.png')}
                style={[styles.actionIcon, {height: 27, width: 25}]} 
              />
              <Text style={styles.actionCount}>{item.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require('../../src/assets/share-icon.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
              <Image
                source={isMuted 
                  ? require('../../src/assets/mute.png') 
                  : require('../../src/assets/unmute.png')}
                style={styles.muteIcon}
              />
            </TouchableOpacity>
           <TouchableOpacity onPress={ () => {}}>       
            <Image 
              source={{ uri: item.userImage }} 
              style={styles.smallUserImage} 
            />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
    
  },
  video: {
    width: '100%',
    height: '84%',
    position: 'absolute',
  },
  bufferingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 140,
  },
  
  leftSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 8,
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 8,
  },
  username: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  caption: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    backgroundColor: 'transparent' , // or '#000' for black
    borderRadius: 8,
  },
  musicName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 28,
    height: 28,
    tintColor: 'white',
    marginBottom: 4,
  },
  actionCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  muteButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 20,
  },
  muteIcon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  smallUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default Reel;