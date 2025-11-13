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
import {useNavigation} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import {collection, getDocs, getDoc, doc} from 'firebase/firestore';
import {db} from '../../screen/auth/FireBaseConfig';

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

const NewMessage = () => {
  //const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      // Exclude the current user from the list
      const userList = usersSnapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(user => user.id !== currentUser.uid);
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered users based on search query
  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper to generate chatId
  const getChatId = (idA, idB) => [idA, idB].sort().join('_');

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
        <Text style={styles.headerTitle}>New message</Text>
        <TouchableOpacity>
          {/* <Text style={styles.nextButton}>Next</Text> */}
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.toLabel}>To:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8e8e8e"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={true}
        />
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={[styles.actionButton, {}]}>
        <Image
          source={require('../assets/group_chat_icon.png')}
          style={[
            styles.actionIcon,
            {
              borderColor: 'black',
              borderWidth: 0.05,
              borderRadius: 50,
              backgroundColor: 'rgb(234, 234, 234)',
            },
          ]}
        />
        <View>
          <Text style={styles.actionText}>Create group chat</Text>
          <Text style={{color: '#8e8e8e', fontSize: 13}}>
            Message people privately
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Image
          source={require('../assets/ai_chat_icon.png')}
          style={[
            styles.actionIcon,
            {
              borderColor: 'black',
              borderWidth: 0.05,
              borderRadius: 50,
              backgroundColor: 'rgb(234, 234, 234)',
            },
          ]}
        />
        <View style={styles.aiChatContainer}>
          <View>
            <Text style={styles.actionText}>AI chats</Text>
            <Text style={{color: '#8e8e8e', fontSize: 13}}>
              Message people privately
            </Text>
          </View>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Suggested Section */}
      <Text style={styles.sectionTitle}>Suggested</Text>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={async () => {
              const chatId = getChatId(currentUser.uid, item.id);
              // Always fetch the latest user data for the recipient
              const userDoc = await getDoc(doc(db, 'users', item.id));
              let userData = item;
              if (userDoc.exists()) {
                userData = { id: item.id, ...userDoc.data() };
              }
              // Always fetch the current user's Firestore profile for sender info
             
              // --- Create chat docs for both users before navigating ---
              const { setDoc, serverTimestamp, doc: firestoreDoc } = await import('firebase/firestore');
              // Fetch both users' latest info from Firestore
              const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
              const receiverDoc = await getDoc(doc(db, 'users', item.id));
              const senderUser = senderDoc.exists() ? { id: currentUser.uid, ...senderDoc.data() } : { id: currentUser.uid, username: '', profile: '' };
              const receiverUser = receiverDoc.exists() ? { id: item.id, ...receiverDoc.data() } : { id: item.id, username: '', profile: '' };

              // --- Also update receiver's own info in their chat doc (for robustness) ---
              // Fetch receiver's latest info from Firestore
              let receiverLatest = { id: userData.id, username: '', profile: '' };
              if (receiverDoc.exists()) {
                const data = receiverDoc.data();
                receiverLatest.username = data.username || '';
                receiverLatest.profile = data.profile || '';
              }
              // Update the sender's chat doc to ensure otherUser is up-to-date
              
              // --- End receiver update ---
              // --- End chat doc creation ---

              navigation.navigate('Chat', {
                user: userData,
                chatId,
                senderUsername: senderUser.username,
                senderProfile: senderUser.profile,
              });
            }}
          >
            <Image
              source={getImageSource(item.profile)}
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            {/* <TouchableOpacity style={styles.selectButton}>
              <View style={styles.selectCircle} />
            </TouchableOpacity> */}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.usersList}
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
    paddingLeft: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#dbdbdb',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: '#262626',
    paddingRight: 115,
  },
  nextButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0095f6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#dbdbdb',
  },
  toLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e8e',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingLeft: 20,
    borderBottomWidth: 0,
    borderBottomColor: '#dbdbdb',
  },
  actionIcon: {
    width: 44,
    height: 44,
    marginRight: 15,
    /* tintColor: 'rgb(234, 234, 234)' */
  },
  actionText: {
    fontSize: 13,
    color: '#262626',
  },
  aiChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newBadge: {
    backgroundColor: '#0095f6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 100,
  },
  newBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingLeft: 20,
    //backgroundColor: '#fafafa',
  },
  usersList: {
    paddingBottom: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    color: '#8e8e8e',
  },
  selectButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
});

export default NewMessage;