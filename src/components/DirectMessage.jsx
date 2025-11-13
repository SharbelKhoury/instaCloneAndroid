import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {db} from '../../screen/auth/FireBaseConfig';
import {getAuth} from '@react-native-firebase/auth';
import {collection, getDocs, doc, getDoc, onSnapshot} from 'firebase/firestore';

/* import { UserData } from '../utils/UserData'; */
const localImages = {
  '../assets/data/elondp.png': require('../assets/data/elondp.png'),
  '../assets/data/elonpost.png': require('../assets/data/elonpost.png'),
  '../assets/data/harshdp.png': require('../assets/data/harshdp.png'),
  '../assets/data/harshp.png': require('../assets/data/harshp.png'),
  '../assets/data/modidp.png': require('../assets/data/modidp.png'),
  '../assets/data/modis.png': require('../assets/data/modis.png'),
  '../assets/data/sonamdp.png': require('../assets/data/sonamdp.png'),
  '../assets/data/sonmp.png': require('../assets/data/sonmp.png'),
  '../assets/post2.jpg': require('../assets/post2.jpg'),
  '../assets/post3.jpg': require('../assets/post3.jpg'),
  '../assets/post4.jpg': require('../assets/post4.jpg'),
  '../assets/post5.jpg': require('../assets/post5.jpg'),
  '../assets/data/elonstory.png': require('../assets/data/elonstory.png'),
  '../assets/data/harshs.png': require('../assets/data/harshs.png'),
  '../assets/data/sonams.png': require('../assets/data/sonams.png'),
  '../assets/data/modip.png': require('../assets/data/modip.png'),
  '../assets/CodeBuilder.jpeg': require('../assets/CodeBuilder.jpeg'),
  '../assets/icon/GridIcon.png': require('../assets/icon/GridIcon.png'),
  '../assets/focusedGridIcon.png': require('../assets/focusedGridIcon.png'),
  '../assets/footer/reel.png': require('../assets/footer/reel.png'),
  '../assets/focusedReel.png': require('../assets/focusedReel.png'),
  '../assets/icon/TagsIcon.png': require('../assets/icon/TagsIcon.png'),
  '../assets/focusedTagsIcon.png': require('../assets/focusedTagsIcon.png'),
};

function getImageSource(image) {
  if (!image) return null;
  if (
    typeof image === 'string' &&
    (image.startsWith('http://') || image.startsWith('https://'))
  ) {
    return {uri: image};
  }
  if (typeof image === 'string' && localImages[image]) {
    return localImages[image];
  }
  return null;
}

const DirectMessage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [refreshFlag, setRefreshFlag] = React.useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [selfDetails, setSelfDetails] = useState({});
  const currentUser = getAuth().currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const chatsCol = collection(db, 'users', currentUser.uid, 'chats');
      const unsubscribe = onSnapshot(chatsCol, (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatList);
      });

      return () => unsubscribe();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      // When screen is focused, re-fetch users from Firestore
      setLoading(true);
      const fetchUsers = async () => {
        try {
          const usersCol = collection(db, 'users');
          const userSnapshot = await getDocs(usersCol);
          const userList = userSnapshot.docs.map(doc => doc.data());
          //console.log('Fetched users (focus):', userList); // Debug log
          // setUsers(userList); // This line is removed as per the edit hint
        } catch (error) {
          console.error('Error fetching users from Firestore (focus):', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, []),
  );

  useEffect(() => {
    const fetchAllUserDetails = async () => {
      const details = {};
      const selfInfo = {};
      for (const chat of chats) {
        // Fetch other participant's info
        if (chat.otherUser && chat.otherUser.id) {
          const userDoc = await getDoc(doc(db, 'users', chat.otherUser.id));
          if (userDoc.exists()) {
            details[chat.otherUser.id] = { id: chat.otherUser.id, ...userDoc.data() };
          } else {
            details[chat.otherUser.id] = chat.otherUser;
          }
        }
        // Fetch self info for this chat (if selfUser field exists)
        if (chat.selfUser && chat.selfUser.id) {
          const selfDoc = await getDoc(doc(db, 'users', chat.selfUser.id));
          if (selfDoc.exists()) {
            selfInfo[chat.selfUser.id] = { id: chat.selfUser.id, ...selfDoc.data() };
          } else {
            selfInfo[chat.selfUser.id] = chat.selfUser;
          }
        }
      }
      setUserDetails(details);
      setSelfDetails(selfInfo);
    };
    if (chats.length > 0) fetchAllUserDetails();
  }, [chats]);

  if (loading) {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // When building messagePreviews, include both otherUser and selfUser info
  const messagePreviews = chats.map(chat => ({
    id: chat.id,
    user: userDetails[chat.otherUser?.id] || chat.otherUser,
    self: selfDetails[chat.selfUser?.id] || chat.selfUser || {},
    lastMessage: chat.lastMessage,
    time: chat.lastMessageTimestamp
      ? new Date(chat.lastMessageTimestamp.seconds * 1000).toLocaleTimeString()
      : '',
    unread: chat.unreadCount > 0,
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back_arrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: -70}}>
          <Text style={{fontSize: 24, fontWeight: '500', color: 'black'}}>
            Apps & Games
          </Text>
          <Image
            style={{
              tintColor: 'black',
              position: 'absolute',
              top: 7,
              right: -25,
              width: 19,
              height: 22,
            }}
            source={require('../assets/arrow-down.png')}
          />
          <Image
            style={{
              backgroundColor: 'red',
              borderRadius: 50,
              width: 8,
              height: 8,
              position: 'absolute',
              top: 13,
              right: -38,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NewMessage')}>
          <Image
            source={require('../assets/new_message.png')}
            style={styles.newMessageIcon}
          />
        </TouchableOpacity>
      </View>

      {/* DM Search Input */}
      <View style={styles.dmSearchContainer}>
        <Image
          source={require('../assets/search.png')}
          style={styles.dmSearchIcon}
        />
        <TextInput
          style={styles.dmSearchInput}
          placeholder="Search"
          placeholderTextColor="#8e8e8e"
        />
      </View>

      {/* Online Users */}
      <View style={styles.onlineUsersContainer}>
        <FlatList
          horizontal
          data={messagePreviews}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.userContainer}
              onPress={() =>
                navigation.navigate('Chat', {user: item.user, chatId: item.id})
              }>
              <View style={{alignItems: 'center'}}>
                <View style={styles.userImageContainer}>
                  <Image
                    source={getImageSource(item.user.profile)}
                    style={styles.userImage}
                  />
                  {item.unread && <View style={styles.greenDot} />}
                </View>
              </View>
              <Text style={styles.username}>{item.user.username}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.onlineUsersList}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Title */}

      <View>
        <Text style={styles.title}>Messages</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messagePreviews}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={async () => {
              // Always fetch the latest user data for the other participant
              const userDoc = await getDoc(doc(db, 'users', item.user.id));
              let userData = item.user;
              if (userDoc.exists()) {
                userData = { id: item.user.id, ...userDoc.data() };
              }
              navigation.navigate('Chat', { user: userData, chatId: item.id });
            }}
          >
            <Image source={getImageSource(item.user.profile)} style={styles.messageUserImage} />
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageUsername}>{item.user.username}</Text>
                <Text style={styles.messageTime}>{item.time}</Text>
              </View>
              <View style={styles.messageTextContainer}>
                <Text
                  style={[
                    styles.messageText,
                    item.unread && styles.unreadMessageText
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.messagesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#dbdbdb',
  },
  title: {
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: '500',
    paddingTop: 4,
    paddingBottom: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
  },
  newMessageIcon: {
    width: 24,
    height: 24,
  },
  onlineUsersContainer: {
    borderBottomWidth: 0,
    borderBottomColor: '#dbdbdb',
    marginTop: 20,
    marginLeft: 13,
  },
  onlineUsersList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  userContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  userImageContainer: {
    position: 'relative',
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    marginTop: 5,
    fontSize: 12,
    color: '#262626',
  },
  messagesList: {
    paddingTop: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  messageUserImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  messageUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#262626',
  },
  messageTime: {
    fontSize: 13,
    color: '#8e8e8e',
  },
  messageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: '#8e8e8e',
  },
  unreadMessageText: {
    color: '#262626',
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0095f6',
    marginLeft: 5,
  },
  dmSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
    height: 38,
  },
  dmSearchIcon: {
    width: 18,
    height: 18,
    tintColor: '#8e8e8e',
    marginRight: 8,
  },
  dmSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
    paddingVertical: 0,
  },
  noteCloudWrapper: {
    alignItems: 'center',
    position: 'absolute',
    top: -21,
    left: '34%',
    transform: [{translateX: -32}], // half of cloud width for centering
    zIndex: 10,
  },
  noteCloudContainer: {
    backgroundColor: '#fff',
    borderRadius: 13,
    paddingRight: 5,
    paddingHorizontal: 7,
    paddingVertical: 6,
    minWidth: 80,
    maxWidth: 80,
    height: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  noteCloudText: {
    paddingTop: 5,
    color: '#262626',
    fontSize: 11,
    fontWeight: '400',
  },
  noteCloudTriangle: {
    position: 'absolute',
    left: 20,
    top: '100%',
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    alignSelf: 'flex-start',
    marginTop: -1,
    zIndex: 10,
  },
});

export default DirectMessage;
