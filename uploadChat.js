const admin = require('firebase-admin');
const serviceAccount = require('./instagramclone.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// User info for seeding (using real UIDs)
const user1 = {
  id: '0ex8Enj4TfYbWVZjx9z0gd0Ze4o2', // test@test.com
  username: 'muskelon',
  name: 'Elon Musk',
  profile: 'elondp.png',
};
const user2 = {
  id: 'oUM7lNDnIAQW3Z2rBv5ZWJVacuw1', // appsandgamestestm@...
  username: 'harsh',
  name: 'Harsh Beniwal',
  profile: 'harshdp.png',
};

// Deterministic chatId (sorted)
const getChatId = (idA, idB) => {
  return [idA, idB].sort().join('_');
};

const chatId = getChatId(user1.id, user2.id);

const initialMessages = [
  {
    senderId: user1.id,
    text: 'Hey Harsh, did you see the latest SpaceX launch? 🚀',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  },
  {
    senderId: user2.id,
    text: 'Yes Elon! It was incredible! 🔥',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  },
  {
    senderId: user1.id,
    text: 'Let’s catch up soon.',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  },
];

async function uploadChat() {
  // For both users, create a chat doc in their 'chats' subcollection
  const users = [user1, user2];
  for (const user of users) {
    const otherUser = user.id === user1.id ? user2 : user1;
    const chatRef = db.collection('users').doc(user.id).collection('chats').doc(chatId);
    await chatRef.set({
      participants: [user.id, otherUser.id],
      lastMessage: initialMessages[initialMessages.length - 1].text,
      lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      otherUser: {
        id: otherUser.id,
        username: otherUser.username,
        profile: otherUser.profile,
      },
      unreadCount: 0,
    });
    // Seed messages subcollection
    const messagesCol = chatRef.collection('messages');
    for (const msg of initialMessages) {
      await messagesCol.add(msg);
    }
  }
  console.log('Chat seeded between user1 and user2!');
}

uploadChat(); 