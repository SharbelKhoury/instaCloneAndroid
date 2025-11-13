import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AppColor } from '../utils/AppColors'

const CustomButton = ({buttonTitle, onPress, disabled}) => {
  return (
    <View>
        <TouchableOpacity style={{width: 270,marginTop: 2 ,backgroundColor: disabled ? AppColor.DISABLE_BUTTON : AppColor.Button, borderRadius: 5}} onPress={onPress} disabled={disabled}>
            <View>
             <Text style={{paddingVertical:10, textAlign:"center", color: "white", fontSize:18}}>{buttonTitle}</Text>
            </View>
        </TouchableOpacity> 
    </View>
  )
}

export default CustomButton;