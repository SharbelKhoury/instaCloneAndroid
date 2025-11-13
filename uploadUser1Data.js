const admin = require('firebase-admin');
const serviceAccount = require('./instagramclone.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function copyUserData(sourceUserId, targetUserId) {
  // Reference to source and target documents
  const sourceRef = db.collection('users').doc(sourceUserId);
  const targetRef = db.collection('users').doc(targetUserId);
  
  // 1. Copy the main document
  const userData = (await sourceRef.get()).data();
  await targetRef.set(userData);
  
  // 2. Copy the posts subcollection
  const postsSnapshot = await sourceRef.collection('posts').get();
  const batch = db.batch();
  
  postsSnapshot.forEach(doc => {
    const targetPostRef = targetRef.collection('posts').doc(doc.id);
    batch.set(targetPostRef, doc.data());
    
    // If posts have their own subcollections (like comments), you'd handle them here
    // This would require additional recursive logic
  });
  
  await batch.commit();
  
  console.log(`Successfully copied user ${sourceUserId} to ${targetUserId}`);
}

// Execute the copy
copyUserData('4', 'oEmWiK4vZubfxsc60Bhocy9TOQA3').catch(console.error);