import React, {useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import InputBox from '../../src/components/InputBox';
import CustomButton from '../../src/components/CustomButton';
import { loginInitialValue, loginValidationSchema } from './utils';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        navigation.navigate('Dashboard');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const authInstance = getAuth();
      await signInWithEmailAndPassword(authInstance ,values.username, values.password);
      navigation.navigate('Dashboard');
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'User not found.';
      //  Use this file to import your target's public headers that you would like to expose to Swift.
      //
      //  instagramClone-Bridging-Header.h
      //  instagramClone
      //
      //  Created by Charbel Kh on 18/07/2025.
      //
      if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      setErrors({ password: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Instagram Logo */}
      <Image
        source={require('../../src/assets/Instagram.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Formik Form */}
      <Formik
        initialValues={loginInitialValue}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
          isSubmitting,
        }) => (
          <>
            <View style={styles.inputContainer}>
              <InputBox
                placeholder="Phone number, username, or email"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                touched={touched.username}
                errors={errors.username}
                style={{width: 270}} 
              />
              <InputBox
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                touched={touched.password}
                errors={errors.password}
                secureTextEntry
                style={{width: 270}}
              />
            </View>

            <CustomButton
              buttonTitle={isSubmitting ? 'Logging in...' : 'Log in'}
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={{width: 270}}
            />
          </>
        )}
      </Formik>

      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Log in with Facebook */}
      <TouchableOpacity style={styles.facebookButton} onPress={() => {}}>
      <Image source={require("../../src/assets/icon/facebook-icon.jpeg")} style={{width:30}} resizeMode="contain" />
        <Text style={styles.facebookButtonText}>Log in with Facebook</Text>
      </TouchableOpacity>

      {/* Forgot password */}
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign up */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Links */}
      <View style={styles.footerSpacer} />
      <View style={styles.footerLinksContainer}>
        <View style={styles.footerLinksRow}>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Meta</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>About</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Blog</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Jobs</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Help</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>API</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Locations</Text></TouchableOpacity>
        </View>
        <View style={styles.footerLinksRow}>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Instagram Lite</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Threads</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Contact Uploading & Non-Users</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => {}}><Text style={styles.footerLink}>Meta Verified</Text></TouchableOpacity>
        </View>
        <View style={styles.footerBottomRow}>
          <Text style={styles.footerBottomText}>English</Text>
          <Text style={styles.footerBottomText}>© 2025 Instagram from Meta</Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  logo: {
    width: 250,
    height: 180,
    marginBottom: 25,
    marginTop: 48, 
  },
  inputContainer: {
    marginTop: -50,
    width: '80%',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3797FE',
    borderRadius: 4,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '82%',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 8,
    marginTop: 10,
    color: '#888',
    fontWeight: 'bold',
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -78,
    paddingVertical: 0,
  },
  facebookButtonText: {
    color: '#385185',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: '#385185',
    fontSize: 14,
    marginBottom: 37,
    marginTop: 13,
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
  },
  signupText: {
    color: '#888',
    fontSize: 14,
  },
  signupLink: {
    color: '#3797FE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerSpacer: {
    flex: 1,
  },
  footerLinksContainer: {
    alignItems: 'center',
    marginBottom: 46,
    width: '100%',
  },
  footerLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 4,
  },
  footerLink: {
    color: '#888',
    fontSize: 12,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  footerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerBottomText: {
    color: '#888',
    fontSize: 12,
    marginHorizontal: 8,
  },
});
