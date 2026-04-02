// Socket.IO connection configuration
const SOCKET_SERVER_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://anominie-backend.vercel.app'; // Update with your deployed backend URL

let socket = null;
let currentUsername = '';
let currentCountry = '';
let typingTimeout = null;

// Toggle between email and phone login
document.getElementById('emailLoginBtn').addEventListener('click', function() {
    document.getElementById('emailLoginBtn').classList.add('active');
    document.getElementById('phoneLoginBtn').classList.remove('active');
    document.getElementById('emailLoginSection').classList.remove('hidden');
    document.getElementById('phoneLoginSection').classList.add('hidden');
});

document.getElementById('phoneLoginBtn').addEventListener('click', function() {
    document.getElementById('phoneLoginBtn').classList.add('active');
    document.getElementById('emailLoginBtn').classList.remove('active');
    document.getElementById('phoneLoginSection').classList.remove('hidden');
    document.getElementById('emailLoginSection').classList.add('hidden');
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const countryCode = document.getElementById('countryCode').value;
    const loginError = document.getElementById('loginError');

    // Simple validation - in a real app, this would be more robust
    if ((document.querySelector('.login-option-btn.active').textContent === 'Email' && !validateEmail(email)) ||
        (document.querySelector('.login-option-btn.active').textContent === 'Phone' && !validatePhone(phone, countryCode))) {
        loginError.textContent = 'Please enter a valid email or phone number.';
        return;
    }

    // Store login method and credentials
    if (document.querySelector('.login-option-btn.active').textContent === 'Email') {
        localStorage.setItem('anominie_login_method', 'email');
        localStorage.setItem('anominie_email', email);
    } else {
        localStorage.setItem('anominie_login_method', 'phone');
        localStorage.setItem('anominie_phone', phone);
        localStorage.setItem('anominie_country_code', countryCode);
    }

    // Clear error and show profile setup screen
    loginError.textContent = '';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('profileScreen').classList.remove('hidden');
});

// Handle profile setup form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const country = document.getElementById('country').value;

    if (!username || !country) {
        alert('Please fill in all fields.');
        return;
    }

    // Store user info in localStorage
    localStorage.setItem('anominie_username', username);
    localStorage.setItem('anominie_country', country);

    currentUsername = username;
    currentCountry = country;

    // Show chat screen
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('chatScreen').classList.remove('hidden');

    // Update header with user info
    document.getElementById('displayUsername').textContent = username;
    document.getElementById('displayCountry').textContent = `(${country})`;

    // Initialize WebSocket connection and chat
    initializeSocket(username, country);
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (simple format check)
function validatePhone(phone, countryCode) {
    // Combine country code and phone number
    const fullNumber = countryCode + phone;
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(fullNumber.replace(/[\s\-\(\)]/g, ''));
}

// Initialize Socket.IO connection
function initializeSocket(username, country) {
    console.log('Connecting to server:', SOCKET_SERVER_URL);

    socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });

    // Connection successful
    socket.on('connect', () => {
        console.log('Connected to server with ID:', socket.id);

        // Send user login event
        const userData = {
            username: username,
            country: country,
            email: localStorage.getItem('anominie_email'),
            phone: localStorage.getItem('anominie_phone')
        };

        socket.emit('user_login', userData);
    });

    // Listen for online count updates
    socket.on('online_count', (data) => {
        updateOnlineCount(data.count);
    });

    // Listen for system messages
    socket.on('system_message', (data) => {
        addMessage('System', data.message, false, true);
    });

    // Listen for user joined notifications
    socket.on('user_joined', (data) => {
        if (data.username !== username) {
            addMessage('System', `${data.username} from ${data.country} joined the chat`, false, true);
        }
        updateOnlineCount(data.onlineCount);
    });

    // Listen for user left notifications
    socket.on('user_left', (data) => {
        addMessage('System', `${data.username} left the chat`, false, true);
        updateOnlineCount(data.onlineCount);
    });

    // Listen for new messages
    socket.on('new_message', (data) => {
        const isOwnMessage = data.username === username;
        addMessage(data.username, data.message, isOwnMessage, false, data.country);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
        showTypingIndicator(data.username);
    });

    socket.on('user_stop_typing', () => {
        hideTypingIndicator();
    });

    // Connection error
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        addMessage('System', 'Connection error. Retrying...', false, true);
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        addMessage('System', 'Disconnected from server', false, true);
    });

    // Initialize chat UI
    initializeChatUI();
}

// Initialize chat UI elements
function initializeChatUI() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Typing indicator
    messageInput.addEventListener('input', function() {
        if (socket && socket.connected) {
            socket.emit('typing');

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                socket.emit('stop_typing');
            }, 1000);
        }
    });
}

// Send message function
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message && socket && socket.connected) {
        socket.emit('chat_message', { message: message });
        messageInput.value = '';

        if (typingTimeout) {
            clearTimeout(typingTimeout);
            socket.emit('stop_typing');
        }
    } else if (!socket || !socket.connected) {
        alert('Not connected to server. Please refresh the page.');
    }
}

// Add message to chat
function addMessage(sender, text, isOwn, isSystem = false, country = '') {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (isOwn) {
        messageDiv.classList.add('own');
    }

    if (isSystem) {
        messageDiv.classList.add('system');
    }

    const senderText = isSystem ? sender : `${sender}${country ? ' (' + country + ')' : ''}`;
    messageDiv.innerHTML = `<strong>${senderText}:</strong> ${escapeHtml(text)}`;
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update online user count
function updateOnlineCount(count) {
    document.getElementById('onlineCount').textContent = count;
}

// Show typing indicator
function showTypingIndicator(username) {
    let indicator = document.getElementById('typingIndicator');

    if (!indicator) {
        const messagesContainer = document.getElementById('messagesContainer');
        indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = `<em>${escapeHtml(username)} is typing...</em>`;
        messagesContainer.appendChild(indicator);
    } else {
        indicator.innerHTML = `<em>${escapeHtml(username)} is typing...</em>`;
    }

    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load saved user info if available
window.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('anominie_username');
    const savedCountry = localStorage.getItem('anominie_country');

    if (savedUsername && savedCountry) {
        // Skip login and profile setup if user info is already saved
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('profileScreen').classList.add('hidden');
        document.getElementById('chatScreen').classList.remove('hidden');

        document.getElementById('displayUsername').textContent = savedUsername;
        document.getElementById('displayCountry').textContent = `(${savedCountry})`;

        currentUsername = savedUsername;
        currentCountry = savedCountry;

        initializeSocket(savedUsername, savedCountry);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (socket && socket.connected) {
        socket.disconnect();
    }
});
