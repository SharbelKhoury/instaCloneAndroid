const admin = require('firebase-admin');
const serviceAccount = require('./instagramclone.json');
const { UserData } = require('./src/utils/UserData');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadUsers() {
  for (const user of UserData) {
    const userRef = db.collection('users').doc(user.id.toString());
    const { posts, ...userData } = user;
    await userRef.set(userData);
    if (posts && posts.length) {
      for (const post of posts) {
        await userRef.collection('posts').doc(post.id.toString()).set(post);
      }
    }
  }
  console.log('Upload complete!');
}

uploadUsers();