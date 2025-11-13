import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import PostPreviewModal from './PostPreviewModal';/* 
import {UserData} from '../utils/UserData';
import {UserData2} from '../utils/UserData'; */
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ProfileDetails = () => {
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
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);

  const handlePostPress = post => {
    setSelectedPost(post);
    setModalVisible(true);
  };
  //console.log(users.length, 'users length');
  // Cumulative posts count (posts with images)
  const cumulativePostsCount = users.reduce((acc, user) => {
    if (Array.isArray(user.posts)) {
      return acc + user.posts.filter(post => post && post.image).length;
    }
    return acc;
  }, 0);
  //console.log(cumulativePostsCount, 'cumulative posts count');
  // For demo, use posts of the first user (or adapt as needed)
  const posts = users?.posts || [];
  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePostPress(item)}
      style={{ width: '33%', padding: 1 }}>
      <Image
        source={item.image}
        style={{ width: '100%', aspectRatio: 1 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ paddingHorizontal: 15 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 9
        }}>
        <Image
          style={{ height: 80, width: 80, borderRadius: 50 }}
          source={require('../assets/CodeBuilder.jpeg')}
        />
        <TouchableOpacity>
          <Image
            style={{
              borderRadius: 200,
              width: 23,
              height: 23,
              position: 'absolute',
              top: 20,
              right: 15,
            }}
            source={require('../assets/plus-icon.png')}
          />
        </TouchableOpacity>


        <View style={{ width: 75, alignItems: 'left' }}>
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontWeight: '500',
              width: 200,
              marginStart: 0,
            }}>
            Apps & Games Studio
          </Text>
          <Text style={{ fontSize: 19, marginTop: 10, fontWeight: '600', color: 'black' }}>
            {cumulativePostsCount}
          </Text>
          <Text style={{ fontSize: 15, color: 'black' }}>posts</Text>
        </View>
        <View style={{ width: 75, marginTop: 32, marginLeft: -20, alignItems: 'left' }}>
          <TouchableOpacity>
            <Text style={{ fontSize: 19, fontWeight: '600', color: 'black' }}>
              1539
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 15, color: 'black' }}>followers</Text>
        </View>
        <View style={{ width: 75, marginTop: 32, alignItems: 'left' }}>
          <TouchableOpacity>
            <Text style={{ fontSize: 19, fontWeight: '600', color: 'black' }}>
              1352
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 15, color: 'black' }}>following</Text>
        </View>
      </View>

      <Text style={{ color: 'black', marginTop: 15 }}>React Native</Text>
      <Text style={{ color: 'black' }}>Instagram Clone Project</Text>
      <TouchableOpacity>
        <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>
          See Translation
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent: 'space-between',
          marginHorizontal: 0,
        }}>
        <TouchableOpacity style={styles.button}>
          <Text
            style={{
              backgroundColor: '#E1E1E1',
              width: 145,
              height: 27,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              textAlign: 'center',
              color: 'black',
            }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: '#E1E1E1', borderRadius: 8 },
          ]}>
          <Text
            style={{
              backgroundColor: '#E1E1E1',
              width: 145,
              height: 27,
              paddingHorizontal: 0,
              paddingVertical: 5,
              borderRadius: 9,
              textAlign: 'center',
              color: 'black',
            }}>
            Share Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            resizeMode="fill"
            style={{
              backgroundColor: '#E1E1E1',
              width: 35,
              height: 27,
              marginLeft: -7,
              paddingVertical: 0,
              borderRadius: 8,
            }}
            source={require('../assets/share.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    width: 145,
    height: 27,
    paddingHorizontal: 16,
    paddingVertical: 6,
    overflow: 'hidden', // ensures children are clipped
    alignItems: 'center',
    justifyContent: 'center',
  },
});
