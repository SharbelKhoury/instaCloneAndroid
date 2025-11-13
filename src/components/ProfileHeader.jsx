import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const ProfileHeader = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(!open);
  };
  return (
    <SafeAreaView>
      <View style={{paddingHorizontal: 15, paddingTop: 10, height: 55}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity style={{flexDirection: 'row'}}>
          <Image source={require('../assets/lock.png')} style={{marginTop: 4,marginRight: 5,marginStart: -5,width: 19, height: 19}} />
          <Text style={{fontSize: 24, fontWeight: '500', color: 'black'}}>
            Apps & Games
          </Text>
          <Image style={{tintColor: 'black', position: 'absolute', top: 7, right: -25, width: 19, height: 22}} source={require('../assets/arrow-down.png')} />
          <Image style={{backgroundColor: 'red',borderRadius: 50 ,width: 8, height: 8, position: 'absolute', top: 13, right: -38}} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={{marginRight: 27}} onPress={() => {navigation.navigate('Threads');}}>
              <Image
                style={{height: 26, width: 29}}
                source={require('../../src/assets/icon/threads.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 27}} onPress={() => {navigation.navigate('AddPost');}}>
              <Image
                style={{height: 24, width: 24}}
                source={require('../../src/assets/footer/addPost.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: 5}} onPress={ () => {navigation.navigate('Settings')}}>
              <Image
                style={{height: 20, width: 20, tintColor: 'black'}}
                source={require('../../src/assets/icon/Menu.png')}
              />
            </TouchableOpacity>
            
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({});
