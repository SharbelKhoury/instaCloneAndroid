import React, {useState,useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
//import { currentUser } from '../utils/UserData';
import InputBox from './InputBox';
import Stories from '../components/Stories';
import {useNavigation} from '@react-navigation/native';
import { db, auth } from '../../screen/auth/FireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const currentUser = {
  id: 10,
  name: 'AppsAndGamesInc',
  username: 'apps&games',
  profile: "../assets/CodeBuilder.jpeg", // Use string key for localImages
  // ... other user fields
};

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

const Post = () => {
  const screenWidth = Dimensions.get('window').width;

  // Add these new states for comment modal
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({}); // Store comments by post ID
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Firestore users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, now we can fetch the data.
        const fetchUsersAndPosts = async () => {
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
                return { ...userData, posts };
              })
            );
            setUsers(userList);
          } catch (error) {
            console.error('Error fetching users and posts from Firestore:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchUsersAndPosts();
      } else {
        // User is signed out.
        setLoading(false);
      }
    });

    // Unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  // Function to open comment modal
  const openCommentModal = (post) => {
    setSelectedPostForComments(post);
    setCommentModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to close comment modal
  const closeCommentModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCommentModalVisible(false);
      setSelectedPostForComments(null);
    });
  };

  // Utility to deeply sanitize comments array
  function sanitizeCommentsArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(comment => {
      // Only keep plain object properties
      const sanitizedComment = {
        id: comment.id,
        text: comment.text,
        user: comment.user,
        time: comment.time,
        replies: Array.isArray(comment.replies)
          ? comment.replies.map(reply => ({
              id: reply.id,
              text: reply.text,
              user: reply.user,
              time: reply.time,
              likes: reply.likes || 0
            }))
          : [],
        likes: comment.likes || 0
      };
      return sanitizedComment;
    });
  }

  // Function to post a comment
  const postComment = async () => {
    if (!commentText.trim() || !selectedPostForComments) return;

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      user: currentUser,
      time: new Date().toISOString(),
      replies: [],
      likes: 0
    };

    setComments(prev => ({
      ...prev,
      [selectedPostForComments.id]: [
        ...(prev[selectedPostForComments.id] || []),
        newComment
      ]
    }));

    setCommentText('');

    // Persist comment to Firestore
    try {
      console.log('--- [postComment] START persisting comment ---');
      debugPersist('New comment', newComment);
      debugPersist('selectedPostForComments', selectedPostForComments);
      // Find the user who owns the post
      const postOwner = users.find(u => Array.isArray(u.posts) && u.posts.some(p => p.id === selectedPostForComments.id));
      debugPersist('postOwner', postOwner);
      if (!postOwner) throw new Error('Post owner not found');
      // Defensive check for post ID
      const postId = selectedPostForComments.id;
      if (!postId || typeof postId !== 'string' || postId.trim() === '') {
        console.warn('[postComment] Invalid post ID:', postId);
        debugPersist('Invalid postId', postId);
        return;
      }
      // Directly reference the post document
      const postDoc = doc(db, 'users', postOwner.id.toString(), 'posts', postId);
      debugPersist('postDoc (typeof)', typeof postDoc);
      debugPersist('postDoc (value)', postDoc);
      // Get existing comments from Firestore
      const postSnap = await getDoc(postDoc);
      if (!postSnap.exists()) {
        console.warn('[postComment] Firestore post document does not exist for ID:', postId);
        debugPersist('Firestore postSnap.exists()', postSnap.exists());
        return;
      }
      const postData = postSnap.data();
      debugPersist('postData', postData);
      let existingComments = Array.isArray(postData?.comments) ? postData.comments : [];
      debugPersist('existingComments (before)', existingComments);
      if (!Array.isArray(existingComments)) {
        existingComments = [];
      }
      // Sanitize comments array
      const updatedComments = sanitizeCommentsArray([...existingComments, newComment]);
      debugPersist('updatedComments (sanitized)', updatedComments);
      console.log('[postComment] Attempting Firestore update with payload:', { comments: updatedComments });
      await updateDoc(postDoc, { comments: updatedComments });
      console.log('--- [postComment] SUCCESS: Comment persisted to Firestore ---');
    } catch (err) {
      debugPersist('Error saving comment to Firestore', err);
      console.error('--- [postComment] ERROR saving comment to Firestore:', err);
    } finally {
      console.log('--- [postComment] END persisting comment ---');
    }
  };

  // Calculate time since comment was posted
  const getCommentTime = (commentTime) => {
    const now = new Date();
    const commentDate = new Date(commentTime);
    const diffHours = Math.floor((now - commentDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor((now - commentDate) / (1000 * 60));
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };


  // Flatten all posts from all users
  const allPosts = users.flatMap(user =>
    Array.isArray(user.posts) ? user.posts.map(post => ({ ...post, user })) : []
  );
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState(() =>
    allPosts.reduce((acc, post) => {
      acc[post.id] = post.like;
      return acc;
    }, {}),
  );
  const [openModalId, setOpenModalId] = useState(null); // Track which post's modal is open
  const navigation = useNavigation();

  const handleLike = id => {
    setLikedPosts(prev => ({...prev, [id]: !prev[id]}));
    setLikeCounts(prev => ({
      ...prev,
      [id]: prev[id] + (likedPosts[id] ? -1 : 1),
    }));

    // Update UserData in memory (not persistent)
    const userIndex = users.findIndex(user =>
      user.posts.some(post => post.id === id),
    );
    if (userIndex !== -1) {
      const postIndex = users[userIndex].posts.findIndex(
        post => post.id === id,
      );
      if (postIndex !== -1) {
        users[userIndex].posts[postIndex].like += likedPosts[id] ? -1 : 1;
      }
    }
  };

  function getTimeAgo(post) {
    // Parse date in DD/MM/YYYY format
    const [day, month, year] = post.date.split('/').map(Number);

    // Parse time (handles both "09:00:00" and "04:00 PM")
    let hours = 0,
      minutes = 0;
    if (post.time) {
      if (post.time.includes('AM') || post.time.includes('PM')) {
        // 12-hour format
        const [time, modifier] = post.time.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (modifier === 'PM' && h !== 12) h += 12;
        if (modifier === 'AM' && h === 12) h = 0;
        hours = h;
        minutes = m;
      } else {
        // 24-hour format
        [hours, minutes] = post.time.split(':').map(Number);
      }
    }

    // Create post date object
    const postDate = new Date(year, month - 1, day, hours, minutes);

    // Calculate difference
    const now = new Date();
    const diffMs = now - postDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours <= 0 ? 1 : diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

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

  // Add loading indicator
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{}}>
      <Stories />
      <View
        style={{marginTop: 0, paddingBottom: 20, backgroundColor: '#fafbfa'}}>
        {allPosts.map(post => {
          /* console.log(post.like); */
          const isLiked = likedPosts[post.id];
          return (
            <View
              key={post.id}
              style={{marginTop: 25, paddingBottom: 5, marginBottom: -10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginBottom: 8,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ViewProfile', {user: post.user});
                  }}>
                  <Image
                    style={styles.profileImage}
                    source={getImageSource(post.user.profile)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ViewProfile', {user: post.user});
                  }}>
                  <Text style={styles.name}>{post.user.name}</Text>
                </TouchableOpacity>
                <View style={{position: 'absolute', right: 11}}>
                  <TouchableOpacity onPress={() => setOpenModalId(post.id)}>
                    <Image
                      style={[styles.profileImage, {height: 20, width: 20}]}
                      source={require('../assets/icon/menu-dots.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Settings Modal for this post */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={openModalId === post.id}
                onRequestClose={() => setOpenModalId(null)}>
                <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: -40}}>
                  <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={() => setOpenModalId(null)}
                  />
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderTopEndRadius: 25,
                      borderTopStartRadius: 25,
                      paddingBottom: 30,
                      minHeight: 300,
                    }}>
                    <TouchableOpacity onPress={() => setOpenModalId(null)} activeOpacity={0.7}>
                      <View
                        style={{
                          alignSelf: 'center',
                          width: 36,
                          height: 2.5,
                          borderRadius: 8,
                          backgroundColor: 'grey',
                          marginTop: 12,
                          marginBottom: 18,
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: 50,
                        paddingBottom: 30,
                      }}>
                      <View>
                        <View
                          style={{
                            borderRadius: 65,
                            marginEnd: 64,
                            borderWidth: 0.2,
                            height: 55,
                            width: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity>
                            <Image
                              source={require('../assets/icon/archive.png')}
                              style={{height: 28, width: 25}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            fontWeight: '500',
                            paddingLeft: 12,
                            marginTop: 12,
                          }}>
                          Save
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            borderRadius: 65,
                            marginEnd: 64,
                            borderWidth: 0.2,
                            height: 55,
                            width: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity>
                            <Image
                              source={require('../assets/footer/search.png')}
                              style={{height: 28, width: 28}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={{
                            fontWeight: '500',
                            paddingLeft: 7,
                            marginTop: 12,
                          }}>
                          Remix
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            borderRadius: 65,
                            marginEnd: 64,
                            borderWidth: 0.2,
                            height: 55,
                            width: 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity>
                            <Image
                              source={require('../assets/qr-code.png')}
                              style={{height: 38, width: 38}}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={{fontWeight: '500', marginTop: 12}}>
                          QR code
                        </Text>
                      </View>
                    </View>
                    <View style={{paddingHorizontal: 20,width: 2000,marginLeft: -20,paddingBottom: 50}}>
                      <TouchableOpacity style={{borderTopWidth: 0.2, flexDirection: 'row'}}>
                        <Image source={require('../assets/star-icon.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Add to favorites
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderBottomWidth: 0, flexDirection: 'row'}}>
                        <Image source={require('../assets/unfollow.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Unfollow
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderTopWidth: 0.2, flexDirection: 'row'}}>
                        <Image source={require('../assets/information-circle.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Why you're seeing this post
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderBottomWidth: 0, flexDirection: 'row'}}>
                        <Image source={require('../assets/hide.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Hide
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderBottomWidth: 0, flexDirection: 'row'}}>
                        <Image source={require('../assets/circular-profile.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          About this account
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderBottomWidth: 0, flexDirection: 'row'}}>
                        <Image source={require('../assets/message-alert-red.png')} style={{width: 25, height: 25, margin: 13}} />
                        <Text style={{fontSize: 18, paddingVertical: 15, color: 'red'}}>
                          Report
                        </Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity style={{borderBottomWidth: 1}}>
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Close Friends
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{borderBottomWidth: 1}}>
                        <Text style={{fontSize: 18, paddingVertical: 15}}>
                          Favorites
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </Modal>
              <View>
                <Image
                  source={getImageSource(post.image)}
                  style={{height: 400, width: screenWidth}}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 13,
                  alignItems: 'center',
                  marginTop: 11,
                }}>
                <TouchableOpacity onPress={() => handleLike(post.id)}>
                  <Image
                    style={{
                      width: 22,
                      height: 21,
                      marginBottom: 4,
                      tintColor: !isLiked ? 'black' : 'red',
                    }}
                    source={
                      isLiked
                        ? require('../assets/heart-filled.png')
                        : require('../assets/heart-outline.png')
                    }
                  />
                  <Text style={styles.postText}>{[post.like]}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{marginTop: 1}}>
                  <Image
                    style={{
                      width: 17,
                      marginBottom: -3,
                      height: 18,
                      marginLeft: 15,
                    }}
                    source={require('../assets/Comment.png')}
                  />
                  <Text
                    style={[
                      styles.postText,
                      {marginTop: -12.75, paddingLeft: 40},
                    ]}>
                    {post.comments.length}
                  </Text>
                </TouchableOpacity> */}
                  <TouchableOpacity 
                    style={{marginTop: 1}} 
                    onPress={() => openCommentModal(post)}
                  >
                  <Image
                    style={{
                      width: 17,
                      marginBottom: -3,
                      height: 18,
                      marginLeft: 15,
                    }}
                    source={require('../assets/Comment.png')}
                  />
                  <Text
                    style={[
                      styles.postText,
                      {marginTop: -12.75, paddingLeft: 40},
                    ]}>
                    {post.comments.length + (comments[post.id]?.length || 0)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={{
                      width: 17,
                      marginTop: 2,
                      height: 16,
                      marginLeft: 15,
                    }}
                    source={require('../assets/Messanger.png')}
                  />
                  <Text
                    style={[
                      styles.postText,
                      {marginTop: -15, paddingLeft: 40},
                    ]}>
                    {post.shareCount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 238}}>
                  <Image
                    style={{width: 18, height: 18}}
                    source={require('../assets/icon/archive.png')}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 13,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ViewProfile', {user: post.user});
                  }}>
                  <Text
                    style={{fontSize: 14, fontWeight: '500', paddingTop: 5}}>
                    {post.user.name}
                  </Text>
                </TouchableOpacity>
                <Text style={{paddingTop: 5, fontWeight: '300'}}>
                  {' '}
                  {post.caption}
                </Text>
              </View>
              {/*  <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 13, paddingTop: 5, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>
                  View all {post.user.commentsNumber} comments
                </Text>
              </TouchableOpacity> */}

              {/*    <InputBox
                placeholder=" Add a comment..."
                style={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                  backgroundColor: 'transparent',
                  fontSize: 15,
                  color: '#888',
                  paddingHorizontal: 0,
                  marginHorizontal: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  height: 36,
                  marginLeft: -22,
                }}
              /> */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 13,
                  paddingTop: 5,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 14, fontWeight: '200'}}>
                  {getTimeAgo(post)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

{/* The Modal of Comments */}
<Modal
  visible={commentModalVisible}
  transparent={true}
  animationType="none"
  onRequestClose={closeCommentModal}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.modalContainer}
  >
    {/* Overlay */}
    <TouchableOpacity 
      style={styles.modalOverlay} 
      activeOpacity={1}
      onPress={closeCommentModal}
    />

    {/* Comment modal content */}
    <Animated.View 
      style={[
        styles.commentModal,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [600, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.commentModalHeader}>
        <TouchableOpacity onPress={closeCommentModal}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <Text style={styles.commentModalTitle}>Comments</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      <ScrollView 
        style={styles.commentsList}
        contentContainerStyle={{paddingBottom: 80}}
      >
        {/* Post preview */}
        <View style={styles.postPreview}>
          <Image
            source={getImageSource(selectedPostForComments?.user.profile)}
            style={styles.postPreviewAvatar}
          />
          <View style={styles.postPreviewText}>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <Text style={styles.postPreviewUsername}>
                {selectedPostForComments?.user.name}
              </Text>
              <Text style={styles.postPreviewCaption}>
                {' '}{selectedPostForComments?.caption}
              </Text>
            </View>
            <Text style={styles.postPreviewTime}>
              {selectedPostForComments && getTimeAgo(selectedPostForComments)}
            </Text>
          </View>
        </View>

        {/* All comments */}
        {selectedPostForComments?.comments.map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <Image
              source={getImageSource(comment.user.profile)}
              style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.commentUsername}>
                  {comment.user.name}
                </Text>
                <Text style={styles.commentText}>
                  {' '}{comment.text}
                </Text>
              </View>
              <View style={styles.commentActions}>
                <Text style={styles.commentTime}>
                  {getCommentTime(comment.time)}
                </Text>
                <Text style={styles.commentAction}>Reply</Text>
                <Image
                  source={require('../assets/heart-outline.png')}
                  style={styles.commentLikeIcon}
                />
              </View>

              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <View style={{marginLeft: 32, marginTop: 8}}>
                  {comment.replies.map(reply => (
                    <View
                      key={reply.id}
                      style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8}}
                    >
                      <Image
                        source={getImageSource(reply.user.profile)}
                        style={[styles.commentAvatar, {width: 24, height: 24, borderRadius: 12, marginRight: 8}]}
                      />
                      <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                          <Text style={[styles.commentUsername, {fontSize: 13}]}>
                            {reply.user.name}
                          </Text>
                          <Text style={[styles.commentText, {fontSize: 13}]}>
                            {' '}{reply.text}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={[styles.commentTime, {fontSize: 11}]}>
                            {getCommentTime(reply.time)}
                          </Text>
                          <Text style={[styles.commentAction, {fontSize: 11}]}>
                            Reply
                          </Text>
                          <Image
                            source={require('../assets/heart-outline.png')}
                            style={[styles.commentLikeIcon, {width: 12, height: 12}]}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}

        {/* User-added comments */}
        {selectedPostForComments && comments[selectedPostForComments.id]?.map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <Image
              source={getImageSource(comment.user.profile)}
              style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={styles.commentUsername}>
                  {comment.user.name}
                </Text>
                <Text style={styles.commentText}>
                  {' '}{comment.text}
                </Text>
              </View>
              <View style={styles.commentActions}>
                <Text style={styles.commentTime}>
                  {getCommentTime(comment.time)}
                </Text>
                <Text style={styles.commentAction}>Reply</Text>
                <Image
                  source={require('../assets/heart-outline.png')}
                  style={styles.commentLikeIcon}
                />
              </View>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Comment input */}
      <View style={styles.commentInputContainer}>
        <Image
          source={getImageSource(currentUser.profile)}
          style={styles.currentUserAvatar}
        />
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#8e8e8e"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          onPress={postComment}
          disabled={!commentText.trim()}
        >
          <Text style={[
            styles.postButton,
            {color: commentText.trim() ? '#0095f6' : '#8e8e8e'}
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
  </KeyboardAvoidingView>
</Modal>

{/* ******* */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  postText: {
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 27,
    marginTop: -22,
    color: 'black',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  name: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  postImage: {},
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
  },
  commentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  commentModalTitle: {
    marginTop:13,
    fontWeight: '600',
    fontSize: 15,
  },
  closeButton: {
    fontSize: 24,
    color: '#262626',
  },
  dragHandleContainer: {
    position:'absolute',
    top:5,
    left: 174,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandle: {
    width: 40,
    height: 3,
    backgroundColor: 'grey',
    borderRadius: 2,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postPreview: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  postPreviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postPreviewText: {
    flex: 1,
  },
  postPreviewUsername: {
    fontWeight: '600',
    marginBottom: 4,
  },
  postPreviewCaption: {
    marginBottom: 4,
  },
  postPreviewTime: {
    color: '#8e8e8e',
    fontSize: 12,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    color: '#8e8e8e',
    fontSize: 12,
    marginRight: 16,
  },
  commentAction: {
    color: '#8e8e8e',
    fontSize: 12,
    marginRight: 16,
  },
  commentLikeIcon: {
    width: 14,
    height: 14,
    tintColor: '#8e8e8e',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#dbdbdb',
    backgroundColor: 'white',
  },
  currentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  postButton: {
    marginLeft: 12,
    fontWeight: '600',
  },
});

// Utility debug logger
function debugPersist(label, value) {
  try {
    if (typeof value === 'object') {
      console.log(`[DEBUG] ${label}:`, JSON.stringify(value, null, 2));
    } else {
      console.log(`[DEBUG] ${label}:`, value);
    }
  } catch (e) {
    console.log(`[DEBUG] ${label} (unserializable):`, value);
  }
}

export default Post;
