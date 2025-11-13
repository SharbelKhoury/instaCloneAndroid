import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
/* import { UserData } from '../utils/UserData'; */
import PostPreviewModal from './PostPreviewModal';
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const typeData = [
  {id: 1, image: require('../assets/icon/GridIcon.png'), imageFocused: require('../assets/focusedGridIcon.png')},
  {id: 2, image: require('../assets/footer/reel.png'), imageFocused: require('../assets/focusedReel.png')},
  {id: 3, image: require('../assets/icon/TagsIcon.png'), imageFocused: require('../assets/focusedTagsIcon.png')},
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

const ViewProfile = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        //console.log('Snapshot:', userSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))); // Log doc IDs and data
        const userList = await Promise.all(
          userSnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            // Fetch posts subcollection for this user
            const postsCol = collection(db, 'users', doc.id, 'posts');
            const postsSnapshot = await getDocs(postsCol);
            const posts = postsSnapshot.docs.map(postDoc => postDoc.data());
            return { ...userData, posts };
          })
        );
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      } finally {
        //setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  //console.log(users);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;
  
  // Find the full user data from UserData
  const profileUser = users.find(u => u.id === user.id) || user;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [selectedTab, setSelectedTab] = useState(1);

  const handlePostPress = (post, user) => {
    setSelectedPost({
      profile: user.profile,
      username: user.username,
      name: user.name,
      post: post,
    });
    setModalVisible(true);
  };

  const renderPost = ({ item }) => (
    <View style={styles.gridItem}>
      <TouchableOpacity onPress={() => handlePostPress(item, profileUser)}>
        <Image source={getImageSource(item.image)} style={styles.gridImage} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profileUser.username}</Text>
        {/* Add bell icon */}
        <TouchableOpacity>
          <Image source={require('../assets/bell-icon.png')} style={[styles.headerIcon, {width: 28, marginLeft: 140}]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../assets/icon/menu-dots.png')} style={styles.moreIcon} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.profileHeader}>
          <Image source={getImageSource(profileUser.profile)} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileUser.posts ? profileUser.posts.length : 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <Text style={styles.name}>{profileUser.name}</Text>
        <Text style={styles.bio}>{profileUser.bio}</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.highlightsContainer}>
        <FlatList
          horizontal
          data={[
            { id: '1', title: 'Story', image: getImageSource(profileUser.story.image) },
            { id: '2', title: 'Travel', image: require('../assets/highlight1.jpg') },
            { id: '3', title: 'Food', image: require('../assets/highlight2.jpg') },
          ]}
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

      {/* Type Selector Bar (like ProfilePost.jsx) */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 2
    ,borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb'}}>
        {typeData.map(item => (
          <View
            key={item.id}
            style={{
              width: 66.36,
              marginStart: item.id === 1 ? 45 : 0,
              marginEnd: item.id === 3 ? 40 : 0,
              paddingBottom: item.id === 2 ? 0 : 15,
              borderBottomWidth: selectedTab === item.id ? 2.5 : 0,
            }}>
            <TouchableOpacity onPress={() => setSelectedTab(item.id)}>
              <Image
                  style={{
                    ...(selectedTab === item.id ? {} : {tintColor: 'black'}),
                    ...(selectedTab === item.id ? {width:42.25, height: 42.25} : {}),
                    alignSelf: 'center',
                    width: 21.5,
                    height: 21.5
                  }}
                  source={selectedTab === item.id ? item.imageFocused : item.image}
                />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Posts Grid (only show if first tab is selected) */}
      {selectedTab === 1 && (
        <FlatList
          data={profileUser.posts || []}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsGrid}
        />
      )}
      <PostPreviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        post={selectedPost}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(246, 246, 246)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    marginStart: 16,
  },
  moreIcon: {
    width: 24,
    height: 24,
    marginEnd:5,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 6,
  },
  profileInfoContainer: {
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8e8e8e',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgb(230, 230, 230)',
    borderRadius: 8,
    marginHorizontal: 4,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
  },
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  postsGrid: {
    paddingBottom: 50,
  },
  postContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
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

export default ViewProfile;