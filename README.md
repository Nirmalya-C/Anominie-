# 💬 Anominie

<div align="center">

**Anonymous Chat Platform for 16+ Users**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-anominie.com-blue?style=for-the-badge&logo=google-chrome)](https://anominie.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Nirmalya-C/Anominie-?style=for-the-badge)](https://github.com/Nirmalya-C/Anominie-/commits)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io)

*A safe, anonymous space for conversations — no identity required.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

**Anominie** is an anonymous chat platform built for users aged 16 and above. It provides a clean, distraction-free space for genuine conversations without exposing personal identity.

The project demonstrates a full-stack architecture combining a lightweight vanilla HTML/CSS/JS frontend with a Node.js + Express backend, real-time communication via Socket.io, and data persistence with MongoDB.

**Key goals of this project:**
- Enable completely anonymous, identity-free conversations
- Deliver a smooth, real-time chat experience
- Maintain a minimal, accessible, and responsive user interface

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Complete Anonymity** | Chat without revealing your real identity |
| 👤 **Custom Usernames** | Choose your own anonymous display name |
| 🌍 **Country Selection** | Optional regional context for conversations |
| 📧 **Email & Phone Login** | Flexible sign-in options |
| 💬 **Real-time Messaging** | Instant message delivery via Socket.io |
| 📱 **Responsive Design** | Works seamlessly on mobile and desktop |
| 🌙 **Dark Theme UI** | Easy on the eyes for long sessions |
| 👥 **16+ Age Requirement** | Safe space for young adults |

---

## 🛠 Technologies

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Real-time** | Socket.io |
| **Database** | MongoDB |
| **Auth** | JSON Web Tokens (JWT) |
| **Config** | dotenv |

---

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org) v14 or higher
- [npm](https://www.npmjs.com) or [yarn](https://yarnpkg.com)
- [MongoDB](https://www.mongodb.com) instance (local or Atlas)

### Steps

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
   # Edit .env with your MongoDB URI, JWT secret, and port
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Open the frontend**
   - Open `anonymous_chat.html` in your browser, or serve it via a local HTTP server

---

## 🚀 Usage

### Running the Backend
```bash
cd backend
npm start
```
The API server will start at `http://localhost:3000`.

### Opening the App

You can open `anonymous_chat.html` directly in a browser or serve the project root with any static file server:

```bash
# Example using Python
python3 -m http.server 8080
```

Then visit `http://localhost:8080/anonymous_chat.html`.

---

## 📂 Project Structure

```
Anominie-/
├── anonymous_chat.html     # Main frontend page
├── chat_script.js          # Frontend logic and chat functionality
├── chat_styles.css         # UI styles (dark theme)
├── backend/
│   ├── server.js           # Express server entry point
│   └── package.json        # Backend dependencies
├── CNAME                   # Custom domain config (anominie.com)
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with a clear message
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. Push to your fork and open a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

Please ensure your code is clean, well-commented where necessary, and does not introduce breaking changes.

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it with attribution.

---

## 👨‍💻 Author

**Nirmalya-C** — [GitHub Profile](https://github.com/Nirmalya-C)

---

## 📧 Contact & Support

For questions, bug reports, or feature requests, please [open an issue](https://github.com/Nirmalya-C/Anominie-/issues) on GitHub.

---

## ⚠️ Disclaimer

This is an experimental project intended for educational and proof-of-concept purposes. Use responsibly and ensure compliance with applicable laws and regulations regarding data privacy and user anonymity in your jurisdiction.

---

<div align="center">
  <sub>Last Updated: 2026-03-24</sub>
</div>