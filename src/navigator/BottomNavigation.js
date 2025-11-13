import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Dashboard from '../../screen/dashboard/Dashboard'
import AddPost from '../../screen/dashboard/AddPost'
import Reel from '../../screen/dashboard/Reel'
import Search from '../../screen/dashboard/Search'
import UserProfile from '../../screen/dashboard/UserProfile'

const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
  return (
   <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
    <Tab.Screen name="Home" component={Dashboard} options={{tabBarIcon: ({focused})=>(
        <Image style={{width: 22, height: 22}} source={focused ? require('../assets/footer/sHomeButton.png') : require('../assets/footer/homeButton.png')} />
    )}} />
    <Tab.Screen name="Search" component={Search} options={{tabBarIcon: ({focused})=>(
        <Image style={{width: 22, height: 22}} source={focused ? require('../assets/footer/sSearch.png') : require('../assets/footer/search.png')} />
    )}} />
    <Tab.Screen name="AddPost" component={AddPost} options={{tabBarIcon: ({focused})=>(
        <Image style={{width: 22, height: 22}} source={require('../assets/footer/addPost.png') } />
    )}} />
    <Tab.Screen name="Reels" component={Reel} options={{tabBarIcon: ({focused})=>(
        <Image style={{width: 21, height: 21}} source={require('../assets/footer/reel.png') } />
    )}} />
    <Tab.Screen name="UserProfile" component={UserProfile} options={{tabBarIcon: ({focused})=>(
        <Image style={{width: 32, height: 32, borderRadius: 50, borderWidth: 1, borderColor: '#E1E1E1'}} source={require('../assets/CodeBuilder.jpeg') } />
    )}} />
   </Tab.Navigator>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({})