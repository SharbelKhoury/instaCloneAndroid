const admin = require('firebase-admin');
const serviceAccount = require('./instagramclone.json');
const { reelsData } = require('./src/utils/UserData2');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadReels() {
  try {
    const batch = db.batch(); // Create a batch for bulk write
    const reelsCollectionRef = db.collection('reels'); // Reference to the collection
    
    // Process each reel item
    reelsData.forEach(reel => {
      if (reel && reel.id) {
        // Convert videoUrl if it's a require() statement
        const reelData = {
          ...reel,
          videoUrl: typeof reel.videoUrl === 'string' ? reel.videoUrl : reel.videoUrl.toString()
        };
        
        const reelRef = reelsCollectionRef.doc(reel.id.toString());
        batch.set(reelRef, reelData);
      }
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`${reelsData.length} reels uploaded successfully!`);
  } catch (error) {
    console.error('Error uploading reels:', error);
  }
}

uploadReels();