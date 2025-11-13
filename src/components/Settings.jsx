import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Switch,
} from 'react-native';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {Link} from '@react-navigation/native';

// Note: You need to add these PNG files to your project assets
const icons = {
  back: require('../assets/back_arrow.png'),
  security: require('../assets/security_icon.png'),
  privacy: require('../assets/privacy_icon.png'),
  supervision: require('../assets/supervision_icon.png'),
  notifications: require('../assets/notifications_icon.png'),
  timer: require('../assets/timer_icon.png'),
  lock: require('../assets/lock.png'),
  comment: require('../assets/Comment.png'),
  message: require('../assets/new_message.png'),
  tag: require('../assets/tagged_icon.png'),
  help: require('../assets/info_icon.png'),
  info: require('../assets/info_icon.png'),
  metaIcon: require('../assets/meta_icon.png'),
};

const Settings = ({navigation}) => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            style={[styles.icon, {tintColor: 'black'}]}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings and activity</Text>
        <View style={{width: 24}} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: 10,
          marginHorizontal: 15,
          paddingHorizontal: 10,
          marginBottom: 10,
          position: 'relative',
        }}>
        <Image
          source={require('../assets/search.png')}
          style={{
            width: 18,
            height: 18,
            tintColor: '#666',
            marginRight: 8,
          }}
        />
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          style={{
            flex: 1,
            height: 31,
            fontSize: 16,
            color: '#000',
          }}
          // Remove the placeholder prop
          placeholderTextColor="#aaa"
        />
        {searchValue.length === 0 && (
          <Text
            style={{
              position: 'absolute',
              left: 36, // icon width + marginRight
              top: -4,
              bottom: 0,
              textAlignVertical: 'center',
              fontWeight: '500',
              fontSize: 15,
              color: '#aaa',
              lineHeight: 40,
              zIndex: 1,
              includeFontPadding: false,
            }}
            pointerEvents="none">
            Search
          </Text>
        )}
      </View>
      <ScrollView style={styles.scrollContainer}>
        {/* Account Section */}
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 15,
              position: 'relative',
            }}>
            <Text style={styles.sectionTitle}>Your account</Text>
            <Image
              style={{
                width: 60,
                height: 30,
                position: 'absolute',
                right: 0,
                top: -7,
              }}
              source={icons.metaIcon}
            />
          </View>
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image
                source={require('../assets/icon/TagsIcon2.png')}
                style={[styles.icon, {tintColor: 'black'}]}
              />
              <View>
                <Text style={styles.optionText}>Account Center</Text>
                <Text style={{color: 'rgb(146, 146, 146)', paddingLeft: 15}}>
                  Password, Security, personal details, ad{'\n'}preferences
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
          <Text style={{color: 'rgb(146, 146, 146)', paddingBottom: 15}}>
            Manage your connected experiences and account settings across Meta
            technologies. <Link>Learn more</Link>
          </Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.security} style={styles.icon} />
              <Text style={styles.optionText}>Security</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.privacy} style={styles.icon} />
              <Text style={styles.optionText}>Privacy</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.supervision} style={styles.icon} />
              <Text style={styles.optionText}>Supervision</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        {/* Content Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Preferences</Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.notifications} style={styles.icon} />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.timer} style={styles.icon} />
              <Text style={styles.optionText}>Time spent</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        {/* Who can see your content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who can see your content</Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.lock} style={styles.icon} />
              <Text style={styles.optionText}>Account privacy</Text>
            </View>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.comment} style={styles.icon} />
              <Text style={styles.optionText}>Comments</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        {/* How others can interact with you Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            How others can interact with you
          </Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.message} style={styles.icon} />
              <Text style={styles.optionText}>Messages and story replies</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.tag} style={styles.icon} />
              <Text style={styles.optionText}>Tags and mentions</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        {/* More info and support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More info and support</Text>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.help} style={styles.icon} />
              <Text style={styles.optionText}>Help</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Image source={icons.info} style={styles.icon} />
              <Text style={styles.optionText}>About</Text>
            </View>
            <Image
              source={require('../assets/chevron_right.png')}
              style={styles.chevron}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              const authInstance = getAuth();
              await signOut(authInstance);
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            } catch (e) {
              // Optionally show an error message
              alert('Logout failed. Please try again.');
            }
          }}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Instagram from Meta</Text>
        <Text style={styles.versionText}>Version 263.0.0.19.104</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginRight: 70,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: 'rgb(146, 146, 146)',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  chevron: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    paddingBottom: 20,
  },
});

export default Settings;
