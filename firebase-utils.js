// firebase-utils.js
// Firebase utility functions for Anominie

/**
 * Sign in a user anonymously using Firebase Authentication.
 * Returns the user's uid which is used as their persistent session identifier.
 * @returns {Promise<string>} The anonymous user's uid
 */
async function signInAnonymousUser() {
  try {
    const result = await auth.signInAnonymously();
    return result.user.uid;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    throw error;
  }
}

/**
 * Persist a user profile document in Firestore under the "users" collection.
 * @param {string} uid - Firebase Auth uid
 * @param {string} username - The chosen display name
 * @param {string} country - The user's selected country
 * @returns {Promise<void>}
 */
async function saveUserProfile(uid, username, country) {
  try {
    await db.collection('users').doc(uid).set({
      username,
      country,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw error;
  }
}

/**
 * Post a new message to the global "messages" collection in Firestore.
 * @param {string} uid - Firebase Auth uid of the sender
 * @param {string} username - Display name of the sender
 * @param {string} country - Country of the sender
 * @param {string} text - Message text content
 * @returns {Promise<void>}
 */
async function postMessage(uid, username, country, text) {
  try {
    await db.collection('messages').add({
      uid,
      username,
      country,
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to post message:', error);
    throw error;
  }
}

/**
 * Subscribe to new messages in the "messages" collection.
 * Calls the provided callback with each new message snapshot.
 * @param {Function} callback - Called with each new message object: { id, uid, username, country, text, timestamp }
 * @returns {Function} Unsubscribe function – call to stop listening
 */
function subscribeToMessages(callback) {
  return db.collection('messages')
    .orderBy('timestamp', 'asc')
    .limitToLast(50)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          callback({
            id: change.doc.id,
            uid: data.uid,
            username: data.username,
            country: data.country,
            text: data.text,
            timestamp: data.timestamp
          });
        }
      });
    }, error => {
      console.error('Message listener error:', error);
    });
}

/**
 * Retrieve the stored user profile from Firestore.
 * @param {string} uid - Firebase Auth uid
 * @returns {Promise<Object|null>} User profile object or null if not found
 */
async function getUserProfile(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}
