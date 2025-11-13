import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from '../../screen/auth/Login'
import Signup from '../../screen/auth/Signup'
import Header from '../components/Header'
import Dashboard from '../../screen/dashboard/Dashboard'
import StoryView from '../components/StoryView'
import BottomNavigation from './BottomNavigation'
import Settings from '../components/Settings'
import Threads from '../components/Threads'
import DirectMessage from '../components/DirectMessage'
import NewMessage from '../components/NewMessage'
import ViewProfile from '../components/ViewProfile'
import ChatClassComponent from  '../components/ChatClassComponent'
import Notifications from '../components/Notifications'
import AddStoryPost from '../components/AddStoryPost'
import GalleryScreen from '../components/GalleryScreen'

const Stack = createNativeStackNavigator()

const StackNavigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Home" component={Dashboard} />
            <Stack.Screen name="Story" component={StoryView} />
            <Stack.Screen name="Dashboard" component={BottomNavigation} />
            <Stack.Screen name="Threads" component={Threads} />
            <Stack.Screen name="DirectMessage" component={DirectMessage} />
            <Stack.Screen name="NewMessage" component={NewMessage} />
            <Stack.Screen name="ViewProfile" component={ViewProfile} />
            <Stack.Screen name="Chat" component={ChatClassComponent} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="AddStoryPost" component={AddStoryPost} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />

            {/* <Stack.Screen name="Settings" component={Settings} /> */}
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation