# Anominie - Real-Time Anonymous Chat

A real-time anonymous chat application with user authentication and live online user tracking.

## Features

✅ **User Authentication**
- Email and phone number login options
- User profile setup with username and country

✅ **Real-Time Global Chat**
- WebSocket-based real-time messaging
- See messages from all users instantly
- Typing indicators

✅ **Online User Tracking**
- Live count of online users
- Join/leave notifications
- User presence indicators

✅ **Anonymous & Secure**
- No message history stored
- Complete anonymity
- XSS protection with HTML escaping

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Socket.IO Client
- Responsive design

### Backend
- Node.js & Express
- Socket.IO Server
- In-memory user management

## Local Development

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nirmalya-C/Anominie-
   cd Anominie-
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   Server will run on http://localhost:3000

5. **Open the frontend**
   - Open `anonymous_chat.html` in your browser
   - Or use a local server: `python -m http.server 8000`
   - Access at http://localhost:8000

## Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment with `vercel.json`.

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Configure**
   - The site will be served from the root directory
   - `anonymous_chat.html` is the main entry point

### Backend Deployment Options

#### Option 1: Render.com
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard

#### Option 2: Railway.app
1. Create a new project on Railway
2. Connect your GitHub repository
3. Add the backend service
4. Set root directory to `/backend`
5. Railway will auto-detect and deploy

#### Option 3: Heroku
```bash
cd backend
heroku create anominie-backend
git subtree push --prefix backend heroku main
```

### Update Frontend with Backend URL

After deploying the backend, update the `SOCKET_SERVER_URL` in `chat_script.js`:

```javascript
const SOCKET_SERVER_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://your-backend-url.com'; // Update this
```

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Project Structure

```
Anominie-/
├── anonymous_chat.html      # Main HTML file
├── chat_script.js           # Frontend JavaScript with Socket.IO
├── chat_styles.css          # Styling
├── vercel.json              # Vercel configuration
├── backend/
│   ├── server.js            # Express + Socket.IO server
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
└── README.md
```

## Usage

1. **Login**: Enter your email or phone number
2. **Profile**: Choose a username and select your country
3. **Chat**: Start chatting with people around the world anonymously
4. **Online Users**: See how many users are currently online
5. **Notifications**: Get notified when users join or leave

## API Endpoints

### REST API
- `GET /` - Server status and online count
- `GET /api/stats` - Get statistics (online users, total connections)

### WebSocket Events

#### Client → Server
- `user_login` - User logs in with credentials
- `chat_message` - Send a chat message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `disconnect` - User disconnects

#### Server → Client
- `online_count` - Updated online user count
- `system_message` - System notification
- `user_joined` - A user joined the chat
- `user_left` - A user left the chat
- `new_message` - New chat message received
- `user_typing` - Someone is typing
- `user_stop_typing` - Typing stopped

## Security Features

- XSS protection with HTML escaping
- CORS configuration
- Input validation
- No message persistence (privacy)
- Secure WebSocket connections

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

**Nirmalya-C** - [GitHub Profile](https://github.com/Nirmalya-C)

## Support

For issues or questions, please open an issue on GitHub.

---

**Live Demo**: [Coming Soon]

**Last Updated**: 2026-04-02
