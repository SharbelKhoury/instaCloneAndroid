import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getDatabase, ref, onValue } from '@react-native-firebase/database';

const databaseTest = () => {
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, '/users');

    // Add console logs to see what's happening
    console.log('Fetching data from Firebase...');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Raw data from Firebase:', data);
      
      if (data) {
        console.log('Number of users:', Object.keys(data).length);
        console.log('First user:', data[Object.keys(data)[0]]);
        
        // Log all users one by one
        Object.values(data).forEach((user, index) => {
          console.log(`User ${index + 1}:`, user);
        });
      } else {
        console.log('No data found in database');
      }
    }, (error) => {
      console.error('Error fetching data:', error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>Check console for data</Text>
    </View>
  );
};

export default databaseTest;