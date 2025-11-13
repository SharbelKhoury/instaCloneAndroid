import {
  View,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const localImages = {
  "../assets/data/elondp.png": require("../assets/data/elondp.png"),
  "../assets/data/elonpost.png": require("../assets/data/elonpost.png"),
  "../assets/data/harshdp.png": require("../assets/data/harshdp.png"),
  "../assets/data/harshp.png": require("../assets/data/harshp.png"),
  "../assets/data/modidp.png": require("../assets/data/modidp.png"),
  "../assets/data/modis.png": require("../assets/data/modis.png"),
  "../assets/data/sonamdp.png": require("../assets/data/sonamdp.png"),
  "../assets/data/sonmp.png": require("../assets/data/sonmp.png"),
  "../assets/post2.jpg": require("../assets/post2.jpg"),
  "../assets/post3.jpg": require("../assets/post3.jpg"),
  "../assets/post4.jpg": require("../assets/post4.jpg"),
  "../assets/post5.jpg": require("../assets/post5.jpg"),
  "../assets/data/elonstory.png": require("../assets/data/elonstory.png"),
  "../assets/data/harshs.png": require("../assets/data/harshs.png"),
  "../assets/data/sonams.png": require("../assets/data/sonams.png"),
  "../assets/data/modip.png": require("../assets/data/modip.png"),
  "../assets/CodeBuilder.jpeg": require("../assets/CodeBuilder.jpeg"),
  "../assets/icon/GridIcon.png": require("../assets/icon/GridIcon.png"),
  "../assets/focusedGridIcon.png": require("../assets/focusedGridIcon.png"),
  "../assets/footer/reel.png": require("../assets/footer/reel.png"),
  "../assets/focusedReel.png": require("../assets/focusedReel.png"),
  "../assets/icon/TagsIcon.png": require("../assets/icon/TagsIcon.png"),
  "../assets/focusedTagsIcon.png": require("../assets/focusedTagsIcon.png"),
};

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

const StoryView = ({ route }) => {
  const { item, stories } = route.params;
  const navigation = useNavigation();
  const [currentTime] = useState(new Date());
  const [paused, setPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(item);
  const isMounted = useRef(false);
  const [inputValue, setInputValue] = useState('');
  
  // Calculate hours since story was posted
  const calculateTimeSincePosting = () => {
    let hours = Math.floor(
      (currentTime - new Date(currentStory.story.time * 3600000)) / 3600000
    );
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else {
      hours = Math.floor(hours);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
  };

  const storyTimeHours = calculateTimeSincePosting();
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Handle story progression
  useEffect(() => {
    let animation;
    let timeout;
    
    if (!paused) {
      progressAnim.setValue(0);
      
      animation = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: false,
      });
      
      animation.start(({ finished }) => {
        if (finished) {
          handleNextStory();
        }
      });
      
      timeout = setTimeout(() => {
        handleNextStory();
      }, 15000);
    }
    
    return () => {
      if (animation) animation.stop();
      if (timeout) clearTimeout(timeout);
    };
  }, [paused, currentStory]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleNextStory = () => {
    if (!isMounted.current) return;
    
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    if (currentIndex < stories.length - 1) {
      setCurrentStory(stories[currentIndex + 1]);
      setCurrentStoryIndex(currentIndex + 1);
    } else {
      safeGoBack();
    }
  };

  const handlePrevStory = () => {
    if (!isMounted.current) return;
    
    const currentIndex = stories.findIndex(s => s.id === currentStory.id);
    if (currentIndex > 0) {
      setCurrentStory(stories[currentIndex - 1]);
      setCurrentStoryIndex(currentIndex - 1);
    } else {
      safeGoBack();
    }
  };

  // SAFE navigation back function
  const safeGoBack = () => {
    if (isMounted.current) {
      navigation.goBack();
    }
  };

  // Handle back button and tab switching
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = () => {
        safeGoBack();
        return true;
      };

      const subscription = navigation.addListener('beforeRemove', (e) => {
        // Only prevent default if we're not explicitly calling goBack
        /* if (!e.data.action.source) {
          e.preventDefault();
          backHandler();
        } */
      });

      return () => {
        /* subscription.remove(); */
      };
    }, [navigation])
  );

  const handlePress = (evt) => {
    const touchX = evt.nativeEvent.locationX;
    const screenThird = screenWidth / 3;
    
    if (touchX < screenThird) {
      handlePrevStory();
    } else if (touchX > screenThird * 2) {
      handleNextStory();
    } else {
      setPaused(!paused);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.storyContainer}>
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              style={styles.avatar}
              source={getImageSource(currentStory.profile)}
            />
            <Text style={styles.username}>{currentStory.username}</Text>
            <Text style={styles.time}>{storyTimeHours}</Text>
          </View>
          <TouchableOpacity 
            onPress={safeGoBack} 
            style={styles.closeButtonContainer}
          >
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
        
        {/* Story content */}
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.storyContent} 
          onPress={handlePress}
        >
          <Image
            source={getImageSource(currentStory.story.image)}
            style={styles.storyImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
              style={styles.messageInput}
              value={inputValue}
              onChangeText={setInputValue}
              // Remove the placeholder prop
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
            {inputValue.length === 0 && (
              <Text
                style={{
                  position: 'absolute',
                  left: 20, // match your paddingHorizontal
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: '600',
                  fontSize: 15,
                  top: 0,
                  bottom: 0,
                  textAlignVertical: 'center',
                  lineHeight: 42, 
                }}
                pointerEvents="none"
              >
                Reply to {currentStory.username}...
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Image 
              style={styles.sendIcon} 
              source={require('../assets/Like.png')} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Image 
              style={styles.sendIcon} 
              source={require('../assets/Messanger.png')} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  progressBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 15,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    zIndex: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 25,
    zIndex: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 8,
  },
  closeButtonContainer: {
    padding: 5,
  },
  closeButton: {
    color: 'white',
    fontSize: 28,
    lineHeight: 28,
  },
  storyContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  messageInput: {
    flex: 1,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 21,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  sendButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});
