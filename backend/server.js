require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'anominie';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

let db = null;

async function connectDatabase() {
  if (!mongoUri) {
    console.warn('MONGODB_URI not set; running in API-only mode without database persistence.');
    return;
  }

  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  db = client.db(dbName);
  await db.command({ ping: 1 });
  console.log(`Connected to MongoDB database: ${dbName}`);
}

app.get('/health', async (_req, res) => {
  const database = db ? 'connected' : 'not_configured';
  res.status(200).json({
    status: 'ok',
    database,
    service: 'anominie-backend'
  });
});

app.get('/api/messages', async (_req, res) => {
  if (!db) {
    return res.status(200).json({ messages: [] });
  }

  const messages = await db
    .collection('messages')
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return res.status(200).json({ messages: messages.reverse() });
});

app.post('/api/messages', async (req, res) => {
  const { sender, text } = req.body || {};

  if (!sender || !text || typeof sender !== 'string' || typeof text !== 'string') {
    return res.status(400).json({ error: 'sender and text are required string fields' });
  }

  const payload = {
    sender: sender.trim(),
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  if (!payload.sender || !payload.text) {
    return res.status(400).json({ error: 'sender and text cannot be empty' });
  }

  if (db) {
    await db.collection('messages').insertOne(payload);
  }

  return res.status(201).json({ message: payload });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

connectDatabase()
  .catch((error) => {
    console.error('Database connection failed. Continuing without database.', error.message);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  });
