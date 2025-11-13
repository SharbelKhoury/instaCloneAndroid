import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const PostImage = ({ source }) => {
  return (
    <View style={styles.imageContainer}>
      <Image 
        source={source}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default PostImage;