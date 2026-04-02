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
    
    // Show chat screen
    document.getElementById('profileScreen').classList.add('hidden');
    document.getElementById('chatScreen').classList.remove('hidden');
    
    // Update header with user info
    document.getElementById('displayUsername').textContent = username;
    document.getElementById('displayCountry').textContent = `(${country})`;
    
    // Initialize chat
    initializeChat(username);
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

// Chat functionality
function initializeChat(username) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typingIndicator');
    const clearChatButton = document.getElementById('clearChatButton');
    const newMatchButton = document.getElementById('newMatchButton');
    
    // Add welcome message
    addMessage('System', `Welcome to Anominie, ${username}! You are now chatting anonymously.`, true);
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message) {
            sendButton.disabled = true;
            addMessage(username, message, true);
            messageInput.value = '';
            
            // Simulate other users responding
            setTimeout(() => {
                typingIndicator.classList.remove('hidden');
                setTimeout(() => {
                    typingIndicator.classList.add('hidden');
                    simulateResponse();
                    sendButton.disabled = false;
                }, 700 + Math.random() * 1000);
            }, 500 + Math.random() * 600);
        }
    }

    clearChatButton.addEventListener('click', function() {
        messagesContainer.innerHTML = '';
        addMessage('System', 'Chat cleared. Start a new conversation.', true);
    });

    newMatchButton.addEventListener('click', function() {
        addMessage('System', 'Searching for a new match...', true);
        setTimeout(() => {
            const usernames = ['Alex', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Harper', 'Avery'];
            const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
            addMessage('System', `You are now connected with ${randomUsername}. Say hi!`, true);
        }, 900);
    });
    
    function addMessage(sender, text, isOwn) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (isOwn) {
            messageDiv.classList.add('own');
        }
        
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function simulateResponse() {
        const responses = [
            'Hi there!',
            'How are you doing?',
            'Nice to meet you!',
            'What are you up to?',
            'That\'s interesting!',
            'Tell me more about that.',
            'I agree with you.',
            'Thanks for sharing!',
            'How has your day been?',
            'That sounds fun!',
            'What topic do you like most?',
            'That made me smile!'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const usernames = ['Alex', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Harper', 'Avery'];
        const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
        addMessage(randomUsername, randomResponse, false);
    }
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

        initializeChat(savedUsername);
    }
});
