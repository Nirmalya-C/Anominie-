// server.js
// Anominie Express backend with Firebase Admin SDK integration

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ─── Firebase Admin Initialization ────────────────────────────────────────────
let db;

try {
  // Prefer a JSON string stored in FIREBASE_SERVICE_ACCOUNT_KEY (recommended for
  // serverless environments like Vercel where the filesystem is read-only).
  // Fall back to Application Default Credentials when running on Google Cloud.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }

  db = admin.firestore();
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Firebase Admin SDK initialization failed:', error.message);
}

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Rate limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// ─── Auth middleware ───────────────────────────────────────────────────────────
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing token' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Anominie API' });
});

/**
 * GET /api/messages
 * Returns the last 50 messages ordered by timestamp ascending.
 * Requires a valid Firebase ID token in the Authorization header.
 */
app.get('/api/messages', verifyToken, async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }
  try {
    const snapshot = await db.collection('messages')
      .orderBy('timestamp', 'asc')
      .limitToLast(50)
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null
    }));

    res.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * POST /api/messages
 * Creates a new message document in Firestore.
 * Body: { username, country, text }
 * Requires a valid Firebase ID token.
 */
app.post('/api/messages', verifyToken, async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }

  const { username, country, text } = req.body;

  if (!username || !country || !text) {
    return res.status(400).json({ error: 'username, country, and text are required' });
  }

  if (typeof text !== 'string' || text.trim().length === 0 || text.length > 500) {
    return res.status(400).json({ error: 'text must be a non-empty string of at most 500 characters' });
  }

  try {
    const docRef = await db.collection('messages').add({
      uid: req.user.uid,
      username,
      country,
      text: text.trim(),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Failed to post message:', error);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

/**
 * GET /api/users/:uid
 * Returns the profile for the given uid.
 * A user may only request their own profile.
 */
app.get('/api/users/:uid', verifyToken, async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not available' });
  }

  if (req.user.uid !== req.params.uid) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const doc = await db.collection('users').doc(req.params.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: doc.data() });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── Start server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Anominie server running at http://localhost:${port}`);
});

