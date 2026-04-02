# Anominie-

> **Anonymous Chat Website for 16+ Users**

An experimental platform designed to facilitate anonymous conversations using AI technology. Built as a proof-of-concept to validate front-end application functionality and AI accuracy in real-time chat scenarios.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Anominie- is an experimental project that provides a safe, anonymous space for users aged 16 and above to engage in conversations. The platform leverages AI technology to enhance user experience and test conversational accuracy in real-time environments.

**Purpose**: This project serves as a proof-of-concept to:
- Validate front-end application functionality
- Test AI accuracy in conversational interactions
- Explore anonymous communication platforms

---

## ✨ Features

- 🔐 **Complete Anonymity** - Chat without revealing your identity
- 🤖 **AI-Powered Conversations** - Real-time AI assistance and responses
- 👥 **16+ Age Requirement** - Safe space for young adults
- 💬 **Real-time Chat** - Instant messaging capabilities
- 🎨 **User-Friendly Interface** - Intuitive and clean UI

---

## 🛠 Technologies

- **Frontend**: HTML / CSS / JavaScript (interactive single-page chat UI)
- **Backend**: Node.js / Express.js REST API
- **Database**: MongoDB (optional, with no-DB fallback mode)
- **Deployment**: GitHub Pages for frontend + Node host for backend API

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB (optional; required only for persistent message storage)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nirmalya12345/Anominie-
   cd Anominie-
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # create backend/.env and configure:
   # PORT=3000
   # MONGODB_URI=your_mongodb_connection_string
   # MONGODB_DB=anominie
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

5. **Access the application**
   - Open `anonymous_chat.html` in a browser for local frontend testing
   - Or use the GitHub Pages deployment URL after pushing to `main`

---

## 🚀 Usage

### Starting the Backend API
```bash
cd backend
npm start
```

### Available API Endpoints
- `GET /health` — returns service and database status
- `GET /api/messages` — returns recent chat messages
- `POST /api/messages` — creates message with `{ "sender": "...", "text": "..." }`

### GitHub Pages Deployment
- Workflow: `.github/workflows/pages.yml`
- Trigger: push to `main`
- Publishes static frontend (`anonymous_chat.html` as `index.html`)

---

## 📂 Project Structure

```
Anominie-/
├── anonymous_chat.html      # Frontend entry page
├── chat_styles.css          # Frontend styles
├── chat_script.js           # Frontend behavior
├── backend/
│   ├── server.js            # Express API server
│   └── package.json         # Backend scripts and dependencies
├── .github/workflows/
│   └── pages.yml            # GitHub Pages deployment workflow
└── README.md                # Project documentation
```

---

## 🤝 Contributing

Contributions are welcome! To contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nirmalya12345** - [GitHub Profile](https://github.com/Nirmalya12345)

---

## 📧 Contact & Support

For questions or support, please open an issue on GitHub or contact the project maintainer.

---

## ⚠️ Disclaimer

This is an experimental project. Use at your own risk. Ensure compliance with all applicable laws and regulations regarding data privacy and anonymity in your jurisdiction.

---

**Last Updated**: 2026-03-10 06:43:42
