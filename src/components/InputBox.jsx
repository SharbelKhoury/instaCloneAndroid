import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const InputBox = ({placeholder, onBlur, onChangeText, value, touched, secureTextEntry, keyboardType, maxLength, errors, style}) => {
  return (
    <View style={styles.mainContainer}>
      <TextInput style={[styles.TextInput, style]} 
      placeholder={placeholder}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
      touched={touched}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      maxLength={maxLength}
      />
      {errors && touched && <Text style={{color: "red", paddingEnd: 200}}>{errors}</Text>}
    </View>
  )
}

export default InputBox

const styles = StyleSheet.create({
    mainContainer:{
        
        alignItems: "center"
    },
    TextInput:{
        marginTop: 5,
        borderWidth: 1,
        width: 350,
        borderColor: 'grey',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        height: 40
    }
})