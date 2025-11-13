import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {signupInitialValue, signupValidationSchema} from './utils';
import {Formik} from 'formik';
import InputBox from '../../src/components/InputBox';
import CustomButton from '../../src/components/CustomButton';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { db } from './FireBaseConfig'; // adjust path as needed
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const navigation = useNavigation();
  const handleSignup = async (values) => {
    try {
      // 1. Create user in Firebase Auth (adjust as needed for your flow)
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Create Firestore user doc
      await setDoc(doc(db, 'users', user.uid), {
        username: values.username, // get from your signup form
        profile: values.profile || '', // get from your signup form or set default
        name: values.name || '', // optional
        // ... any other fields you want
      });

      // 3. Navigate or show success
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      // handle error (show message, etc.)
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{flex: 0.8, justifyContent: 'center'}}>
        <Text style={{marginStart:20, fontSize: 22, fontWeight: '700', marginBottom: 20}}>Signup with your mobile number</Text>
        <Formik
          initialValues={signupInitialValue}
          validationSchema={signupValidationSchema}
          onSubmit={handleSignup}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid,
          }) => {
            return (
              <View>
                <InputBox
                  placeholder={'Mobile Number'}
                  onChangeText={handleChange('number')}
                  onBlur={handleBlur('number')}
                  value={values.number}
                  touched={touched.number}
                  errors={errors.number}
                  maxLength={10}
                  keyboardType={'numeric'}
                />
                {/* <InputBox
                  placeholder={'Password'}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  touched={touched.password}
                  errors={errors.password}
                  secureTextEntry={true}
                /> */}
                <CustomButton buttonTitle={"Signup"} onPress={handleSubmit} disabled={!isValid} />
              </View>
            );
          }}
        </Formik>
      </View>
      <View style={{justifyContent: "flex-end", marginBottom: 40, flex: 0.2}}>
        <TouchableOpacity onPress={()=> navigation.goBack()}>
        <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  imageLogo: {
    maxWidth: 350,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
