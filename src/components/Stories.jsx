import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { UserData } from '../utils/UserData'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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

const Stories = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => doc.data());
        //console.log('Fetched users:', userList); // Debug log
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Only show users with a valid story image
  const usersWithStories = users.filter(item => item.story && item.story.image);

  return (
    <View style={{ marginTop: 8, backgroundColor: '#fafbfa' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 6 }}
      >
        {/* Add custom circle at the beginning */}
        <View key="me-story" style={{ alignItems: 'center', position: 'relative' }}>
          <TouchableOpacity style={{ marginHorizontal: 3 }} onPress={() => navigation.navigate('AddStoryPost')}>
            <View
              style={{
                width: 81,
                height: 81,
                borderRadius: 39,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2,
                borderWidth: 0.1,
                borderColor: '#888',
                backgroundColor: 'white',
              }}
            >
              <Image
                style={{ width: 70, height: 70, borderRadius: 65 }}
                source={require('../assets/CodeBuilder.jpeg')}
              />
              {/* Plus icon circle */}
              <View
                style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -2,
                  width: 28,
                  height: 28,
                  borderRadius: 74,
                  backgroundColor: 'white',
                  borderWidth: 0.1,
                  borderColor: '#888',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <Image
                  source={require('../assets/plus-icon-black.png')}
                  style={{ width: 22, height: 22, borderRadius: 59 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', color: 'black' }}>Your Story</Text>
        </View>
        {/* Render the rest of the stories */}
        {usersWithStories.map((item) => (
          <View key={item.id}>
            <TouchableOpacity onPress={() => navigation.navigate('Story', { item, stories: usersWithStories })} style={{ marginHorizontal: 3 }}>
              <LinearGradient
                colors={['#d62976', '#d62976', '#feda75', '#fa7e1e', '#ff9900', '#4f5bd5']}
                locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 81, // 70 + 2*4 (padding) = 78
                  height: 81,
                  borderRadius: 39, // half of width/height
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 75, // 70 + 2*1 (padding)
                    height: 75,
                    borderRadius: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    style={{ width: 70, height: 70, borderRadius: 35 }}
                    source={getImageSource(item.story?.image)}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={{ textAlign: 'center', color: 'black' }}>{item.username}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Stories;