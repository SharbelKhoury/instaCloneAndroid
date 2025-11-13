import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBdsBTXQSkeAvyesDdSFKmtjOh0xxt6hhU",
    authDomain: "instagramclone-45474.firebaseapp.com",
    databaseURL: "https://instagramclone-45474-default-rtdb.firebaseio.com",
    projectId: "instagramclone-45474",
    storageBucket: "instagramclone-45474.firebasestorage.app",
    messagingSenderId: "1096087219478",
    appId: "1:1096087219478:web:c9c9544002679c85f7f437",
    measurementId: "G-DWZLQ5K833"
  };

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);