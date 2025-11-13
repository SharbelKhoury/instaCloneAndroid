// SearchComponent.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView
} from 'react-native';
/* import { searchItems } from '../../src/utils/UserData'; */
import { db } from '../../screen/auth/FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';

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


const { width } = Dimensions.get('window');
const itemSize = width / 3 - 2; // 3-column grid with 1px gap

const Search = () => {
  const [searchItems, setSearchItems] = useState([]);

  useEffect(() => {
    const fetchSearchItems = async () => {
      try {
        const searchItemCol = collection(db, 'search_items');
        const searchItemSnapshot = await getDocs(searchItemCol);
        const searchItemList = searchItemSnapshot.docs.map(doc => doc.data());
        //console.log('Fetched searchItems:', searchItemList); // Debug log
        setSearchItems(searchItemList);
      } catch (error) {
        console.error('Error fetching users from Firestore:', error);
      } finally {
        //setLoading(false);
      }
    };
    fetchSearchItems();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Posts');

  const filteredItems = searchItems.filter(item =>
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      {item.type === 'video' && <View style={styles.videoBadge} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8e8e8e"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Search Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Posts' && styles.activeTab]}
          onPress={() => setActiveTab('Posts')}
        >
          <Text style={[styles.tabText, activeTab === 'Posts' && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Users' && styles.activeTab]}
          onPress={() => setActiveTab('Users')}
        >
          <Text style={[styles.tabText, activeTab === 'Users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Tags' && styles.activeTab]}
          onPress={() => setActiveTab('Tags')}
        >
          <Text style={[styles.tabText, activeTab === 'Tags' && styles.activeTabText]}>Tags</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {activeTab === 'Posts' ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            {activeTab === 'Users' ? 'User results will appear here' : 'Tag results will appear here'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  searchInput: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#262626',
  },
  tabContainer: {
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
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e8e',
  },
  activeTabText: {
    color: '#262626',
  },
  itemContainer: {
    width: itemSize,
    height: itemSize,
    margin: 1,
    backgroundColor: '#fafafa',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 50,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8e8e8e',
    fontSize: 16,
  },
});

export default Search;