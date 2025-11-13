import { StyleSheet, View } from 'react-native'
import React from 'react'
import ProfileHeader from '../../src/components/ProfileHeader'
import ProfileDetails from '../../src/components/ProfileDetails'
import ProfilePost from '../../src/components/ProfilePost'

const UserProfile = () => {
  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader />
      <ProfileDetails />
      <ProfilePost />
    </View>
  )
}

export default UserProfile

const styles = StyleSheet.create({})