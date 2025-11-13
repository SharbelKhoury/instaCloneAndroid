import {SafeAreaViewBase} from 'react-native';
import React, {useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPos, setModalPos] = useState({x: 0, y: 0, width: 0, height: 0});
  const touchableRef = useRef(null);
  const navigation = useNavigation();

  const handlePress = () => {
    if (touchableRef.current) {
      touchableRef.current.measure((fx, fy, width, height, px, py) => {
        setModalPos({x: px, y: py, width, height});
        setModalVisible(true);
      });
    }
  };

  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaView
      style={{backgroundColor: '#fafbfa', paddingBottom: -6, zIndex: 1}}>
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 10,
          backgroundColor: '#fafbfa',
        }}>
        <View style={{backgroundColor: '#fafbfa', flexDirection: 'row'}}>
          <TouchableOpacity
            ref={touchableRef}
            onPress={handlePress}
            activeOpacity={0.7}>
            <Image
              style={{height: 48, width: 135}}
              source={require('../assets/Instagram.jpeg')}
            />
            <Image
              style={{
                tintColor: 'black',
                position: 'absolute',
                top: 27,
                right: 8,
                width: 9,
                height: 17,
              }}
              source={require('../assets/arrow-down.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginTop: 7}}>
          <TouchableOpacity style={{marginRight: 15}} onPress={() =>navigation.navigate('Notifications')}>
            <Image
              style={{width: 26, height: 23, marginTop: 4}}
              source={require('../assets/Like.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={() => navigation.navigate('DirectMessage')}>
            <View style={{position: 'relative'}}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../assets/messenger.png')}
              />
              <View
                style={{
                  borderRadius: 100,
                  width: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 17,
                  width: 20,
                  position: 'absolute',
                  bottom: 15,
                  left: 14,
                  backgroundColor: 'red',
                }}>
                <Text style={styles.notifications} adjustsFontSizeToFit={true}>
                  5
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
          <View style={{flex: 1}}>
            <View
              style={[
                styles.modalBox,
                {
                  position: 'absolute',
                  top: modalPos.y + modalPos.height + 5, // 5px below
                  left: modalPos.x,
                },
              ]}>
              <TouchableOpacity style={styles.row} onPress={closeModal}>
                <Image
                  source={require('../assets/group-icon.png')}
                  style={{marginRight: 6, tintColor: 'black'}}
                />
                <Text
                  style={[styles.text, {fontWeight: '500', marginBottom: 0}]}>
                  Following
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={closeModal}>
                <Image
                  source={require('../assets/favorites.png')}
                  style={{marginRight: 6, tintColor: 'black'}}
                />
                <Text
                  style={[styles.text, {fontWeight: '500', marginBottom: 0}]}>
                  Favorites
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 160,
    paddingVertical: 8,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center', // <-- ensures vertical centering
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    marginBottom: 0,
    marginTop: 2, // <-- nudge text lower
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  notifications: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
  },
});

export default Header;
