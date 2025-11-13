import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../src/components/Header'
import Post from '../../src/components/Post'

const Dashboard = () => {

  return (
    <View style={{flex:1, backgroundColor: '#fafbfa'}}> 
      <Header />
      <Post />
    </View>
  )
}

export default Dashboard