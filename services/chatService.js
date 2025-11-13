import { db } from '../screen/auth/FireBaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

export const createChat = async (userId1, userId2) => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', userId1));
  
  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.participants.includes(userId2);
  });

  if (existingChat) {
    return existingChat.id;
  }

  const newChatRef = await addDoc(chatsRef, {
    participants: [userId1, userId2],
    lastMessage: {
      text: '',
      senderId: '',
      timestamp: serverTimestamp()
    },
    createdAt: serverTimestamp()
  });

  return newChatRef.id;
};

export const sendMessage = async (chatId, senderId, text) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const chatRef = doc(db, `chats/${chatId}`);

  const messageData = {
    text,
    senderId,
    timestamp: serverTimestamp(),
    read: false
  };

  // Add message to subcollection
  await addDoc(messagesRef, messageData);

  // Update last message in chat document
  await updateDoc(chatRef, {
    lastMessage: {
      text,
      senderId,
      timestamp: serverTimestamp()
    }
  });
};

export const subscribeToChat = (chatId, callback) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    callback(messages);
  });
};

export const markMessagesAsRead = async (chatId, userId) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, 
    where('senderId', '!=', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach(doc => {
    const messageRef = doc.ref;
    batch.update(messageRef, { read: true });
  });

  await batch.commit();
};