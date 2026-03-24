// firebase-config.js
// Firebase configuration for Anominie
// Replace these values with your Firebase project credentials
// Set these as environment variables in your deployment (e.g., Vercel)

const firebaseConfig = {
  apiKey: typeof FIREBASE_API_KEY !== 'undefined' ? FIREBASE_API_KEY : '',
  authDomain: typeof FIREBASE_AUTH_DOMAIN !== 'undefined' ? FIREBASE_AUTH_DOMAIN : '',
  projectId: typeof FIREBASE_PROJECT_ID !== 'undefined' ? FIREBASE_PROJECT_ID : '',
  storageBucket: typeof FIREBASE_STORAGE_BUCKET !== 'undefined' ? FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: typeof FIREBASE_MESSAGING_SENDER_ID !== 'undefined' ? FIREBASE_MESSAGING_SENDER_ID : '',
  appId: typeof FIREBASE_APP_ID !== 'undefined' ? FIREBASE_APP_ID : ''
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter(k => !firebaseConfig[k]);
if (missingKeys.length > 0) {
  const msg = 'Firebase configuration is incomplete. Missing: ' + missingKeys.join(', ') +
    '. Please set the required environment variables (see .env.example).';
  console.error(msg);
  document.addEventListener('DOMContentLoaded', function() {
    const err = document.getElementById('loginError');
    if (err) err.textContent = 'Service configuration error. Please contact the site administrator.';
  });
  throw new Error(msg);
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firestore and Auth references
const db = firebase.firestore();
const auth = firebase.auth();
