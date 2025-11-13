import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
//import {UserData2} from '../utils/UserData';
import PostPreviewModal from './PostPreviewModal'; // Import the modal component
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
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

const typeData = [
  { id: 1, image: require('../assets/icon/GridIcon.png'), imageFocused: require('../assets/focusedGridIcon.png') },
  { id: 2, image: require('../assets/footer/reel.png'), imageFocused: require('../assets/focusedReel.png') },
  { id: 3, image: require('../assets/icon/TagsIcon.png'), imageFocused: require('../assets/focusedTagsIcon.png') },
];

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

const ProfilePost = () => {

  const [selected, setSelected] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [story, setStory] = useState([]);
  const [highlightStory, setHighlightStory] = useState(null); // Store first story from posts
  const route = useRoute();
  //const { user } = route.params;

  const handlePostPress = (postData, userData) => {
    // Compose the modal data structure
    const modalData = {
      profile: userData.profile || '',
      username: userData.username || '',
      name: userData.name || '',
      post: {
        image: postData.image,
        caption: postData.caption,
        like: postData.like,
        date: postData.date,
      },
    };
    setSelectedPost(modalData);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = await Promise.all(
          userSnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            // Fetch posts subcollection for this user
            const postsCol = collection(db, 'users', doc.id, 'posts');
            const postsSnapshot = await getDocs(postsCol);
            const posts = postsSnapshot.docs.map(postDoc => postDoc.data());
            // Get first story from posts (if exists)
            let firstStory = null;
            if (posts.length > 0 && posts[1].image) {
              firstStory = posts[1].image;
            }
            // Set highlight story only for the first user (or you can adjust logic)
            if (!highlightStory && firstStory) {
              setHighlightStory(firstStory);
            }
            // Fetch story data if exists
            const storyCol = collection(db, 'users', doc.id, 'story');
            const storySnapshot = await getDocs(storyCol);
            const storyData = storySnapshot.docs.map(storyDoc => storyDoc.data());
            setStory(storyData);
            return {
              ...userData,
              story: storyData.length > 0 ? storyData[0] : null,
              posts
            };
          })
        );
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      }
    };
    fetchUsers();
  }, []);

  //const profileUser = users.find(u => u.id === user.id) || user;

  //const profileUser = users;

  const renderItem = ({ item }) => {
    // Find the user for this post
    const user = users.find(u => u.posts.some(p => p.id === item.id)) || {};
    return (
      <View style={styles.gridItem}>
        <TouchableOpacity onPress={() => handlePostPress(item, user)}>
          <Image source={getImageSource(item.image)} style={styles.gridImage} />
        </TouchableOpacity>
      </View>
    );
  };
  /* const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity onPress={() => handlePostPress(item, profileUser)}>
          <Image 
            style={{height: 130.9, width: 130.9}} 
            source={item.post.image} 
          /> 
        </TouchableOpacity>
      </View>
    );
  }; */
  //console.log("story is:" + highlightStory);

const flatListRef = useRef(null);
  return (
    <View style={{ marginTop: 20, flex: 1 }}>

      {/* Highlights */}

      <View style={[styles.highlightsContainer, { marginBottom: 20 }]}>

        <FlatList
          horizontal
          data={[
            highlightStory ? { id: '1', title: 'Story', image: getImageSource(highlightStory) } : null,
            { id: '2', title: 'Travel', image: require('../assets/highlight1.jpg') },
            { id: '3', title: 'Food', image: require('../assets/highlight2.jpg') },
          ].filter(Boolean)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.highlightItem}>
              <Image source={item.image} style={styles.highlightImage} />
              <Text style={styles.highlightTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.highlightsList}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {typeData.map(item => {
          return (
            <View
              key={item.id}
              style={{
                width: 66.36,
                marginStart: item.id === 1 ? 45 : 0,
                marginEnd: item.id === 3 ? 40 : 0,
                paddingBottom: item.id === 2 ? 0 : 15,
                borderBottomWidth: selected === item.id ? 2.5 : 0,
              }}>
              <TouchableOpacity onPress={() => setSelected(item.id)}>
                <Image
                  style={{
                    ...(selected === item.id ? {} : { tintColor: 'black' }),
                    ...(selected === item.id ? { width: 42.25, height: 42.25 } : {}),
                    alignSelf: 'center',
                    width: 21.5,
                    height: 21.5
                  }}
                  source={selected === item.id ? item.imageFocused : item.image}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={{ flex: 1, marginTop: 0 }}>
        
        {selected == 1 && (
          <FlatList
            ref={flatListRef}
            data={users.flatMap(u => u.posts) || []}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={{ paddingBottom: 1 }}
            style={{ flex: 1 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
      </View>
      {/* Add the modal component */}
      <PostPreviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        post={selectedPost}
      />
    </View>
  );
};

export default ProfilePost;

const styles = StyleSheet.create({
  highlightsContainer: {
    paddingVertical: 10,
  },
  highlightsList: {
    paddingLeft: 15,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  highlightTitle: {
    fontSize: 12,
    color: '#262626',
    marginTop: 5,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    maxWidth: '33.33%',
  },
  gridImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 2,
  },
});