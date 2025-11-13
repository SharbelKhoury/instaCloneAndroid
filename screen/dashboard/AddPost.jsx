// AddPost.jsx (No MaterialIcons version)
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';

const { width } = Dimensions.get('window');

const AddPost = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('normal');
  const scrollRef = useRef();

  // Sample filters
  const filters = [
    { name: 'normal', label: 'Normal' },
    { name: 'clarendon', label: 'Clarendon' },
    { name: 'gingham', label: 'Gingham' },
    { name: 'moon', label: 'Moon' },
    { name: 'lark', label: 'Lark' },
    { name: 'reyes', label: 'Reyes' },
  ];

  const handleImageSelect = () => {
    // Image picker would go here
    setSelectedImage('https://example.com/placeholder-image.jpg');
  };

  const handlePost = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image 
            source={require('../../src/assets/back-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <TouchableOpacity 
              style={styles.selectImageButton}
              onPress={handleImageSelect}
            >
              <Image
                source={require('../../src/assets/add_photo.png')}
                style={styles.addPhotoIcon}
              />
              <Text style={styles.selectImageText}>Select an Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        {selectedImage && (
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>Filters</Text>
            <Image
              source={require('../../src/assets/filter-icon.png')}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        )}

        {/* Caption Input */}
        <View style={styles.captionContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#8e8e8e"
            multiline
            value={caption}
            onChangeText={setCaption}
          />
          <Image
            source={require('../../src/assets/emoji-icon.png')}
            style={styles.smallIcon}
          />
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option}>
            <Image
              source={require('../../src/assets/location-icon.png')}
              style={styles.smallIcon}
            />
            <Text style={styles.optionText}>Add Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={require('../../src/assets/tag-people-icon.png')}
              style={styles.smallIcon}
            />
            <Text style={styles.optionText}>Tag People</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Image
              source={require('../../src/assets/settings-icon.png')}
              style={styles.smallIcon}
            />
            <Text style={styles.optionText}>Advanced Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Image
                source={require('../../src/assets/close-icon.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterPreviewContainer}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.filterPreviewImage} 
            />
            <Text style={styles.filterName}>{activeFilter}</Text>
          </View>

          <ScrollView horizontal contentContainerStyle={styles.filterScroll}>
            {filters.map(filter => (
              <TouchableOpacity 
                key={filter.name}
                style={styles.filterOption}
                onPress={() => setActiveFilter(filter.name)}
              >
                <Image 
                  source={{ uri: selectedImage }} 
                  style={[
                    styles.filterThumbnail,
                    activeFilter === filter.name && styles.selectedFilter
                  ]} 
                />
                <Text style={styles.filterLabel}>{filter.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  icon: {
    width: 24,
    height: 24,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  addPhotoIcon: {
    width: 50,
    height: 50,
    tintColor: '#8e8e8e',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  shareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0095f6',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectImageButton: {
    alignItems: 'center',
  },
  selectImageText: {
    marginTop: 10,
    color: '#8e8e8e',
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  filterButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
    maxHeight: 100,
  },
  optionsContainer: {
    paddingTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#262626',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0095f6',
  },
  filterPreviewContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  filterPreviewImage: {
    width: width - 40,
    height: width - 40,
    resizeMode: 'contain',
  },
  filterName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
  },
  filterScroll: {
    paddingHorizontal: 15,
  },
  filterOption: {
    alignItems: 'center',
    marginRight: 15,
  },
  filterThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: '#0095f6',
  },
  filterLabel: {
    fontSize: 14,
    color: '#262626',
  },
});

export default AddPost;