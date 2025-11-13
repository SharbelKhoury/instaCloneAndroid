import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {db, auth} from '../../screen/auth/FireBaseConfig';
import {getAuth} from '@react-native-firebase/auth';
import {
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  where,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { Image as RNImage } from 'react-native';

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

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, chatId, senderUsername, senderProfile, receiverUsername, receiverProfile } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef();
  const currentUser = getAuth().currentUser;
  const [receiverData, setReceiverData] = useState({ username: receiverUsername || '', profile: receiverProfile || '', name: '', id: user?.id || '' });
  const [myProfile, setMyProfile] = useState({ username: '', profile: '' });

  useEffect(() => {
    const fetchReceiverData = async () => {
      if (!user?.id) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setReceiverData({
            id: user.id,
            username: data.username || receiverUsername || '',
            profile: data.profile || receiverProfile || '',
            name: data.name || data.username || receiverUsername || '',
          });
        } else {
          setReceiverData({
            id: user.id,
            username: receiverUsername || '',
            profile: receiverProfile || '',
            name: receiverUsername || '',
          });
        }
      } catch (error) {
        setReceiverData({
          id: user.id,
          username: receiverUsername || '',
          profile: receiverProfile || '',
          name: receiverUsername || '',
        });
        console.error("Error fetching receiver data:", error);
      }
    };
    fetchReceiverData();
  }, [user?.id, receiverUsername, receiverProfile]);

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!currentUser) return;
      const myDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (myDoc.exists()) {
        const data = myDoc.data();
        setMyProfile({
          username:
            data.username || currentUser.displayName ,
          profile: data.profile || currentUser.photoURL || '',
        });
      } else {
        setMyProfile({
          username: currentUser.displayName,
          profile: currentUser.photoURL || '',
        });
      }
    };
    fetchMyProfile();
  }, [currentUser]);

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!user?.id) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          setReceiverData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching receiver data:", error);
      }
    };
  
    fetchReceiver();
  }, [user?.id]);

  const [otherUserData, setOtherUserData] = useState(user);

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!user.id) return;
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (userDoc.exists()) {
        setOtherUserData({id: user.id, ...userDoc.data()});
      }
    };
    fetchOtherUser();
  }, [user.id]);

  // Real-time message updates from the correct chat subcollection
  useEffect(() => {
    if (!currentUser || !chatId) return;
    const messagesRef = collection(
      db,
      'users',
      currentUser.uid,
      'chats',
      chatId,
      'messages',
    );
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });
    return unsubscribe;
  }, [currentUser?.uid, chatId]);

  // Mark all unread messages as read when opening the chat
  useEffect(() => {
    if (!currentUser || !chatId) return;
    const markAsRead = async () => {
      const messagesRef = collection(
        db,
        'users',
        currentUser.uid,
        'chats',
        chatId,
        'messages',
      );
      const q = query(
        messagesRef,
        where('read', '==', false),
        where('senderId', '!=', currentUser.uid),
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach(docSnap => {
        batch.update(docSnap.ref, {read: true});
      });
      await batch.commit();
      // Reset unreadCount in chat doc
      const chatRef = doc(db, 'users', currentUser.uid, 'chats', chatId);
      await updateDoc(chatRef, {unreadCount: 0});
    };
    markAsRead();
  }, [currentUser?.uid, chatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

    const handleSend = async () => {
      if (!input.trim() || !currentUser || !chatId) return;
    
      // Fetch recipient's user data
      let recipientUser = { id: user.id };
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        recipientUser.username = data.username || "";
        recipientUser.profile = data.profile || "";
      } else {
        recipientUser.username = user.username || "";
        recipientUser.profile = user.profile || "";
      }

    // Fetch sender's user data (the current user)
    let senderUser = { id: currentUser.uid, username: '', profile: '' };
    const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (senderDoc.exists()) {
      const data = senderDoc.data();
      senderUser.username = data.username || '';
      senderUser.profile = data.profile || '';
    }
    //console.log('Saving to recipient chat doc:', recipientUser);
    //console.log('Saving to sender chat doc:', senderUser);

    const messageData = {
      senderId: currentUser.uid,
      text: input,
      timestamp: serverTimestamp(),
      read: false,
    };

    try {
      // Add to current user's chat
      const myMessagesRef = collection(db, 'users', currentUser.uid, 'chats', chatId, 'messages');
      await addDoc(myMessagesRef, messageData);

      // Add to other user's chat
      const otherMessagesRef = collection(db, 'users', recipientUser.id, 'chats', chatId, 'messages');
      await addDoc(otherMessagesRef, messageData);

      // Update chat docs
      const myChatRef = doc(db, 'users', currentUser.uid, 'chats', chatId);
      const otherChatRef = doc(db, 'users', recipientUser.id, 'chats', chatId);

      // For the sender's chat doc, set otherUser to recipient's info
      await setDoc(myChatRef, {
        participants: [currentUser.uid, recipientUser.id],
        lastMessage: input,
        lastMessageTimestamp: serverTimestamp(),
        otherUser: {
          id: recipientUser.id,
          username: recipientUser.username,
          profile: recipientUser.profile,
        },
        unreadCount: 0,
      }, { merge: true });

      // For the receiver's chat doc, set otherUser to sender's info (from Firestore)
      await setDoc(otherChatRef, {
        participants: [currentUser.uid, recipientUser.id],
        lastMessage: input,
        lastMessageTimestamp: serverTimestamp(),
        otherUser: {
          id: senderUser.id,
          username: senderUser.username,
          profile: senderUser.profile,
        },
        unreadCount: 1,
      }, { merge: true });

      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({item}) => {
    const isMe = item.senderId === currentUser?.uid;
    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowOther,
        ]}>
        {!isMe && (
          <Image
            source={getImageSource(user?.profile)}
            style={styles.avatarSmall}
          />
        )}
        {item.text &&
          (isMe ? (
            <LinearGradient
              colors={['#3a3a8e', '#8f5be8', 'rgb(104, 30, 134)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.bubbleMe}>
              <Text style={[styles.messageText, styles.textMe]}>
                {item.text}
              </Text>
              {/* Optionally show time */}
            </LinearGradient>
          ) : (
            <View style={styles.bubbleOther}>
              <Text style={[styles.messageText, styles.textOther]}>
                {item.text}
              </Text>
              {/* Optionally show time */}
            </View>
          ))}
      </View>
    );
  };

  // Helper to determine if current user is the receiver
  const isReceiver = user?.id === currentUser?.uid;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Keep your existing header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back_arrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerUserInfo}>
          <View style={styles.avatarActiveWrapper}>
            <Image
              source={getImageSource(
                isReceiver ? (receiverProfile || receiverData?.profile) : (otherUserData?.profile)
              )}
              style={styles.avatar}
            />
            <View style={styles.activeDot} />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {isReceiver ? (receiverUsername || receiverData?.username || 'User') : (otherUserData?.username || receiverData?.username || 'User')}
            </Text>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Image
              source={require('../assets/info_icon.png')}
              style={[styles.headerActionIcon, {width: 29, height: 29}]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/phone_call.png')}
              style={styles.headerActionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/video_call.png')}
              style={[styles.headerActionIcon, {width: 32, height: 32}]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: false })}
      />

      {/* Input Bar - Keep your existing input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputBarWrapper}>
          <LinearGradient
            colors={['#bc2a8e', '#e95950', '#fccc63']}
            style={styles.cameraIconWrapper}>
            <TouchableOpacity>
              <Image
                source={require('../assets/camera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.inputBarContent}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor="#8e8e8e"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            {input.trim() === '' ? (
              <>
                <TouchableOpacity>
                  <Image
                    source={require('../assets/mic.png')}
                    style={[styles.inputBarIcon, {height: 25, width: 25}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../assets/image.png')}
                    style={[
                      styles.inputBarIcon,
                      {height: 33, width: 29, marginRight: 6},
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../assets/emoji.png')}
                    style={[
                      styles.inputBarIcon,
                      {height: 24, width: 24, marginRight: 6},
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require('../assets/plus.png')}
                    style={[styles.inputBarIcon, {height: 28, width: 28}]}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={handleSend}>
              <LinearGradient
                colors={['#3a3a8e', '#8f5be8', 'rgb(104, 30, 134)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  borderRadius: 15,
                  width: 50,
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 6,
                  marginRight: 6,
                }}
              >
                <RNImage
                  source={require('../assets/Messanger.png')}
                  style={{ width: 20, height: 20, tintColor: 'white' }}
                />
              </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
const styles = StyleSheet.create({
  timeText: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeTextMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextOther: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#262626',
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 8,
  },
  avatarActiveWrapper: {
    position: 'relative',
    marginRight: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4cd964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    marginLeft: 6,
  },
  headerStatus: {
    fontSize: 13,
    color: '#8e8e8e',
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerActionIcon: {
    width: 26,
    height: 26,
    marginHorizontal: 4,
    /*  tintColor: '#262626', */
    marginLeft: 17,
  },
  messagesList: {
    padding: 12,
    paddingBottom: 20,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateSeparatorText: {
    fontSize: 13,
    color: '#8e8e8e',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  bubbleMe: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderBottomRightRadius: 6,
    marginLeft: 40,
    marginRight: 0,
    marginVertical: 2,
  },
  bubbleOther: {
    maxWidth: '75%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    marginRight: 8,
    marginLeft: 0,
    marginVertical: 2,
  },
  messageText: {
    fontSize: 16,
  },
  textMe: {
    color: '#fff',
  },
  textOther: {
    color: '#262626',
  },
  inputBarWrapper: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 56,
  },
  inputBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 2,
    marginLeft: 6,
    marginRight: 0,
    minHeight: 40,
  },
  cameraIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cameraIcon: {
    width: 39,
    height: 39,
  },
  input: {
    fontSize: 16,
    color: '#262626',
    paddingVertical: 6,
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: 6,
  },
  inputBarIcon: {
    width: 26,
    height: 26,
    marginHorizontal: 2,
    tintColor: '#8e8e8e',
  },
});
