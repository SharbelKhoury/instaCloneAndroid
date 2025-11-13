import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserData } from '../utils/UserData';

const Notifications = () => {
  const navigation = useNavigation();

  // Generate notifications from UserData
  const notifications = [
    {
      id: '1',
      type: 'like',
      users: [
        UserData[1], // Harsh Beniwal
        UserData[2], // Daniella Rahmeh
        UserData[3], // MaguybouGhosn
      ],
      postImage: UserData[0].posts[0]?.image, // Elon's first post
      time: '2h',
      read: false
    },
    {
      id: '2',
      type: 'comment',
      user: UserData[1], // Harsh Beniwal
      text: 'This looks amazing!',
      postImage: UserData[1].posts[0]?.image, // Harsh's first post
      time: '5h',
      read: true
    },
    {
      id: '3',
      type: 'follow',
      user: UserData[2], // Daniella Rahmeh
      time: '1d',
      read: false
    },
    {
      id: '4',
      type: 'like',
      users: [
        UserData[0], // Elon Musk
        UserData[3], // MaguybouGhosn
      ],
      postImage: UserData[2].posts[0]?.image, // Daniella's first post
      time: '3h',
      read: true
    },
    {
      id: '5',
      type: 'comment',
      user: UserData[3], // MaguybouGhosn
      text: 'Great content!',
      postImage: UserData[3].posts[0]?.image, // Maguybou's first post
      time: '7h',
      read: false
    },
  ];

  const renderNotification = ({ item }) => {
    let content;
    
    switch(item.type) {
      case 'like':
        content = (
          <>
            <View style={styles.userImagesContainer}>
              {item.users.slice(0, 3).map((user, index) => (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => navigation.navigate('ViewProfile', { user })}
                >
                  <Image
                    source={user.profile}
                    style={[
                      styles.userImage,
                      { marginLeft: index > 0 ? -10 : 0 }
                    ]}
                  />
                </TouchableOpacity>
              ))}
              {item.users.length > 3 && (
                <View style={styles.moreUsers}>
                  <Text style={styles.moreUsersText}>+{item.users.length - 3}</Text>
                </View>
              )}
            </View>
            <View style={styles.notificationText}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: item.users[0] })}>
                <Text style={styles.boldText}>{item.users[0].username}</Text>
              </TouchableOpacity>
              {item.users.length > 1 ? (
                <Text> and {item.users.length - 1} others liked your post</Text>
              ) : (
                <Text> liked your post</Text>
              )}
            </View>
          </>
        );
        break;
        
      case 'comment':
        content = (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: item.user })}>
              <Image source={item.user.profile} style={styles.userImage} />
            </TouchableOpacity>
            <View style={styles.notificationText}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: item.user })}>
                <Text style={styles.boldText}>{item.user.username}</Text>
              </TouchableOpacity>
              <Text> commented: "{item.text}"</Text>
            </View>
          </>
        );
        break;
        
      case 'follow':
        content = (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: item.user })}>
              <Image source={item.user.profile} style={styles.userImage} />
            </TouchableOpacity>
            <View style={styles.notificationText}>
              <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', { user: item.user })}>
                <Text style={styles.boldText}>{item.user.username}</Text>
              </TouchableOpacity>
              <Text> started following you</Text>
            </View>
          </>
        );
        break;
        
      default:
        content = null;
    }

    return (
      <TouchableOpacity 
        style={[
          styles.notificationContainer,
          !item.read && styles.unreadNotification
        ]}
      >
        <View style={styles.notificationContent}>
          {content}
        </View>
        {item.type !== 'follow' && (
          <Image source={item.postImage} style={styles.postImage} />
        )}
        {item.type === 'follow' && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeText}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back_arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {marginEnd: 27}]}>Notifications</Text>
        <TouchableOpacity></TouchableOpacity>
        {/* <TouchableOpacity>
          <Image source={require('../assets/settings-icon.png')} style={styles.settingsIcon} />
        </TouchableOpacity> */}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>You</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
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
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  tabText: {
    fontSize: 16,
    color: '#8e8e8e',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  unreadNotification: {
    backgroundColor: '#f8f8f8',
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 5,
  },
  moreUsers: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreUsersText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
  },
  notificationText: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  boldText: {
    fontWeight: '600',
    color: '#262626',
  },
  postImage: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginLeft: 10,
  },
  followButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  timeText: {
    position: 'absolute',
    bottom: 1,
    right: 15,
    fontSize: 12,
    color: '#8e8e8e',
  },
});

export default Notifications;