// Current Firebase authenticated user uid
let currentUid = null;
// Firestore real-time listener unsubscribe handle
let unsubscribeMessages = null;

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

    loginError.textContent = '';
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('profileScreen').classList.remove('hidden');
});

// Handle profile setup form submission
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const country = document.getElementById('country').value;

    if (!username || !country) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        // Sign in anonymously with Firebase so we get a persistent uid
        currentUid = await signInAnonymousUser();

        // Persist profile in Firestore
        await saveUserProfile(currentUid, username, country);

        // Cache profile locally for quick reload
        localStorage.setItem('anominie_uid', currentUid);
        localStorage.setItem('anominie_username', username);
        localStorage.setItem('anominie_country', country);

        showChatScreen(username, country);
    } catch (error) {
        alert('Failed to set up your session. Please try again.');
        console.error(error);
    }
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (simple format check)
function validatePhone(phone, countryCode) {
    const fullNumber = countryCode + phone;
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(fullNumber.replace(/[\s\-\(\)]/g, ''));
}

// Show the chat screen and wire up the UI
function showChatScreen(username, country) {
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('chatScreen').classList.remove('hidden');

    document.getElementById('displayUsername').textContent = username;
    document.getElementById('displayCountry').textContent = `(${country})`;

    initializeChat(username, country);
}

// Chat functionality with Firebase Firestore real-time sync
function initializeChat(username, country) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Show a local welcome message (not stored in Firestore)
    addLocalMessage('System', `Welcome to Anominie, ${username}! You are now chatting anonymously.`);

    // Stop any existing listener before starting a new one
    if (unsubscribeMessages) {
        unsubscribeMessages();
    }

    // Subscribe to real-time messages from Firestore
    unsubscribeMessages = subscribeToMessages(function(msg) {
        const isOwn = msg.uid === currentUid;
        addMessage(msg.username, msg.text, isOwn);
    });

    // Remove duplicate event listeners by replacing the send button
    const newSendButton = sendButton.cloneNode(true);
    sendButton.parentNode.replaceChild(newSendButton, sendButton);

    const newMessageInput = messageInput.cloneNode(true);
    messageInput.parentNode.replaceChild(newMessageInput, messageInput);

    newSendButton.addEventListener('click', sendMessage);
    newMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const input = newMessageInput;
        const text = input.value.trim();

        if (!text) return;

        input.value = '';

        try {
            await postMessage(currentUid, username, country, text);
        } catch (error) {
            console.error('Failed to send message:', error);
            addLocalMessage('System', 'Message failed to send. Please try again.');
        }
    }
}

// Render a message received from Firestore
function addMessage(sender, text, isOwn) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (isOwn) {
        messageDiv.classList.add('own');
    }

    const senderEl = document.createElement('strong');
    senderEl.textContent = sender + ': ';

    const textNode = document.createTextNode(text);

    messageDiv.appendChild(senderEl);
    messageDiv.appendChild(textNode);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Render a local-only system message (not stored in Firestore)
function addLocalMessage(sender, text) {
    addMessage(sender, text, false);
}

// Restore session on page load.
// Firebase Auth persists the anonymous session via IndexedDB/localStorage by default,
// so onAuthStateChanged will return the same anonymous user without creating a new one.
window.addEventListener('DOMContentLoaded', function() {
    const savedUsername = localStorage.getItem('anominie_username');
    const savedCountry = localStorage.getItem('anominie_country');

    if (savedUsername && savedCountry) {
        // Wait for Firebase to restore the persisted auth state
        const unsubscribeAuth = auth.onAuthStateChanged(async function(user) {
            unsubscribeAuth(); // only need the first event

            if (user) {
                currentUid = user.uid;

                // Refresh profile from Firestore, fall back to cached values on error
                const profile = await getUserProfile(currentUid);
                const username = (profile && profile.username) || savedUsername;
                const country = (profile && profile.country) || savedCountry;

                showChatScreen(username, country);
            }
            // If user is null the session expired – stay on the login screen
        });
    }
});