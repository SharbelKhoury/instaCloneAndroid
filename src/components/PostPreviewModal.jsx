import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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

const PostPreviewModal = ({ visible, onClose, post }) => {
  if (!post) return null;

  // Defensive: handle new structure
  const profileImage = post.profile;
  const username = post.username;
  const name = post.name;
  const postImage = post.post?.image;
  const caption = post.post?.caption;
  const like = post.post?.like;
  const date = post.post?.date;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          {profileImage && <Image source={getImageSource(profileImage)} style={styles.profileImage} />}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>

        {postImage && (
          <Image
            source={getImageSource(postImage)}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity>
            <Image source={require('../assets/Like.png')} style={[styles.icon,{width:26,height: 26}]} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/Comment.png')} style={[styles.icon,{height: 26}]} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/Messanger.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        {like !== undefined && <Text style={styles.likes}>{like} likes</Text>}
        {caption && <Text style={styles.caption}>{caption}</Text>}
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalCard: {
    position: 'absolute',
    top: height * 0.13,
    left: width * 0.07,
    width: width * 0.86,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 2,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 18,
    marginLeft: 18,
    marginBottom: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userInfo: {
    marginLeft: 8,
  },
  username: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    color: 'black',
    fontSize: 13,
  },
  postImage: {
    width: '92%',
    height: width * 0.9,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 6,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 18,
  },
  likes: {
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 8,
  },
  caption: {
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 4,
  },
  date: {
    color: '#aaa',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 2,
  },
});

export default PostPreviewModal;