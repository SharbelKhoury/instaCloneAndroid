// uploadSearchItems.js

const admin = require('firebase-admin');
const path = require('path');

// Adjust this to your actual service account JSON path
const serviceAccount = require(path.resolve(__dirname, './instagramclone.json'));

// Your JSON array imported from local file
const { searchItems } = require('./src/utils/UserData2');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadSearchItems() {
  console.log('Starting upload...');

  if (!Array.isArray(searchItems)) {
    console.error('searchItems is not a valid array.');
    return;
  }

  let uploadCount = 0;

  for (const item of searchItems) {
    if (item && item.id) {
      const docRef = db.collection('search_items').doc(item.id.toString());
      await docRef.set(item);
      uploadCount++;
    }
  }

  console.log(`${uploadCount} search items uploaded successfully!`);
  process.exit(0); // Exit Node process cleanly
}

uploadSearchItems().catch((error) => {
  console.error('Error uploading search items:', error);
  process.exit(1);
});
