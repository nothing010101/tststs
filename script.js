// Global Variables
let currentFeature = '';
let chatMessages = [];

// DOM Elements
const mainSearch = document.getElementById('mainSearch');
const chatModal = document.getElementById('chatModal');
const loginModal = document.getElementById('loginModal');
const chatMessages_el = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .token-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add parallax effect to columns
    window.addEventListener('scroll', handleParallax);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Feature Selection
function selectFeature(feature) {
    currentFeature = feature;
    
    // Remove active class from all pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    // Add active class to selected pill
    event.target.closest('.pill').classList.add('active');
    
    // Update search placeholder
    const placeholders = {
        'summarize': 'Rangkum teks atau dokumen...',
        'critique': 'Analisis dan berikan kritik...',
        'imagine': 'Buat gambar atau konsep...',
        'token': 'Tanya tentang token VANITA...'
    };
    
    mainSearch.placeholder = placeholders[feature] || 'Tanya apa saja';
    
    // Add visual feedback
    showNotification(`Mode ${feature} dipilih`);
}

// Search Handling
function handleSearch() {
    const query = mainSearch.value.trim();
    if (!query) return;
    
    // Simulate AI processing
    showLoadingState();
    
    setTimeout(() => {
        openChatWithMessage(query);
        mainSearch.value = '';
        hideLoadingState();
    }, 1000);
}

function openChatWithMessage(message) {
    openChat();
    if (message) {
        addMessageToChat('user', message);
        setTimeout(() => {
            generateAIResponse(message);
        }, 500);
    }
}

// Chat Modal Functions
function openChat() {
    chatModal.style.display = 'flex';
    chatModal.style.opacity = '0';
    setTimeout(() => {
        chatModal.style.opacity = '1';
    }, 10);
    
    // Focus on chat input
    setTimeout(() => {
        chatInput.focus();
    }, 300);
}

function closeChat() {
    chatModal.style.opacity = '0';
    setTimeout(() => {
        chatModal.style.display = 'none';
    }, 300);
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessageToChat('user', message);
    chatInput.value = '';
    
    // Generate AI response
    setTimeout(() => {
        generateAIResponse(message);
    }, 500);
}

function addMessageToChat(sender, message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    
    if (sender === 'user') {
        messageEl.style.cssText = `
            background: #ff7b54;
            color: white;
            padding: 12px 16px;
            border-radius: 15px 15px 5px 15px;
            margin: 10px 0 10px auto;
            max-width: 80%;
            word-wrap: break-word;
        `;
    } else {
        messageEl.style.cssText = `
            background: #e3f2fd;
            color: #1976d2;
            padding: 12px 16px;
            border-radius: 15px 15px 15px 5px;
            margin: 10px auto 10px 0;
            max-width: 80%;
            word-wrap: break-word;
        `;
    }
    
    messageEl.appendChild(messageContent);
    chatMessages_el.appendChild(messageEl);
    
    // Scroll to bottom
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
}

function generateAIResponse(userMessage) {
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML = '<p>Vanita sedang mengetik...</p>';
    typingEl.style.cssText = `
        background: #f0f0f0;
        color: #666;
        padding: 12px 16px;
        border-radius: 15px;
        margin: 10px auto 10px 0;
        max-width: 80%;
        font-style: italic;
    `;
    chatMessages_el.appendChild(typingEl);
    chatMessages_el.scrollTop = chatMessages_el.scrollHeight;
    
    // Remove typing indicator and add response
    setTimeout(() => {
        chatMessages_el.removeChild(typingEl);
        
        let response = generateContextualResponse(userMessage);
        addMessageToChat('ai', response);
    }, 1500);
}

function generateContextualResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Token-related responses
    if (lowerMessage.includes('token') || lowerMessage.includes('vanita') || lowerMessage.includes('harga')) {
        return 'Token VANITA akan diluncurkan di Flaunch.gg dengan total supply 100B. 95% untuk fair launch dan 5% untuk tim. Ini akan menjadi token governance untuk ekosistem AI tanpa batas kami!';
    }
    
    // Technical responses
    if (lowerMessage.includes('bagaimana') || lowerMessage.includes('cara')) {
        return 'Sebagai AI tanpa batas, saya menggunakan teknologi terdepan untuk memberikan respons yang tidak terbatas sensor. Saya dapat membantu dengan berbagai tugas dari analisis hingga kreativitas!';
    }
    
    // Privacy responses
    if (lowerMessage.includes('privasi') || lowerMessage.includes('aman')) {
        return 'Privasi adalah prioritas utama Vanita. Semua percakapan Anda dienkripsi dan tidak disimpan. Arsitektur kami memastikan AI tetap privat dan tidak dapat dilacak.';
    }
    
    // Creative responses
    if (lowerMessage.includes('buat') || lowerMessage.includes('kreatif') || lowerMessage.includes('ide')) {
        return 'Saya siap membantu kreativitas Anda! Dari menulis cerita, membuat konsep, hingga brainstorming ide-ide inovatif. Apa yang ingin Anda ciptakan hari ini?';
    }
    
    // Default responses
    const defaultResponses = [
        'Pertanyaan yang menarik! Sebagai AI tanpa batas, saya dapat membantu Anda mengeksplorasi topik ini lebih dalam.',
        'Saya memahami apa yang Anda tanyakan. Mari kita bahas ini dengan perspektif yang lebih luas.',
        'Terima kasih telah bertanya! Ini adalah area di mana AI tanpa sensor seperti saya dapat memberikan wawasan yang unik.',
        'Pertanyaan yang bagus! Saya akan memberikan analisis yang komprehensif tentang hal ini.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Login Modal Functions
function showLogin() {
    loginModal.style.display = 'flex';
    loginModal.style.opacity = '0';
    setTimeout(() => {
        loginModal.style.opacity = '1';
    }, 10);
}

function closeLogin() {
    loginModal.style.opacity = '0';
    setTimeout(() => {
        loginModal.style.display = 'none';
    }, 300);
}

function showSignup() {
    // For now, just show notification
    showNotification('Fitur pendaftaran segera hadir!');
}

// More Options
function showMoreOptions() {
    const moreFeatures = [
        { name: 'Terjemah', icon: '🌐' },
        { name: 'Analisis', icon: '📊' },
        { name: 'Kode', icon: '💻' },
        { name: 'Musik', icon: '🎵' }
    ];
    
    let optionsHtml = '<div class="more-options-popup">';
    moreFeatures.forEach(feature => {
        optionsHtml += `<button class="option-btn" onclick="selectCustomFeature('${feature.name}')">${feature.icon} ${feature.name}</button>`;
    });
    optionsHtml += '</div>';
    
    // Create and show popup
    const popup = document.createElement('div');
    popup.innerHTML = optionsHtml;
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        z-index: 3000;
    `;
    
    // Add styles for buttons
    const style = document.createElement('style');
    style.textContent = `
        .more-options-popup {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .option-btn {
            padding: 15px 20px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .option-btn:hover {
            background: #f0f0f0;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                style.remove();
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

function selectCustomFeature(featureName) {
    currentFeature = featureName.toLowerCase();
    mainSearch.placeholder = `Gunakan ${featureName}...`;
    showNotification(`Mode ${featureName} dipilih`);
    
    // Close popup
    document.querySelectorAll('.more-options-popup').forEach(el => {
        el.parentElement.remove();
    });
}

// Launchpad Integration
function redirectToLaunch() {
    // Show loading animation
    const btn = event.target;
    btn.innerHTML = 'Memuat...';
    btn.disabled = true;
    
    setTimeout(() => {
        // In production, this would redirect to actual launchpad
        showNotification('Launchpad akan segera dibuka!');
        btn.innerHTML = 'Lihat Launchpad';
        btn.disabled = false;
        
        // Simulate opening launchpad
        window.open('https://flaunch.gg', '_blank');
    }, 1000);
}

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff7b54, #ff6b3d);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        z-index: 4000;
        box-shadow: 0 8px 25px rgba(255, 123, 84, 0.3);
        transform: translateX(400px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function showLoadingState() {
    const btn = document.querySelector('.send-btn');
    btn.innerHTML = '<div class="loading-spinner"></div>';
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function hideLoadingState() {
    const btn = document.querySelector('.send-btn');
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
        </svg>
    `;
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.2;
    
    document.querySelectorAll('.column').forEach((column, index) => {
        column.style.transform += ` translateY(${parallax * (index + 1)}px)`;
    });
}

function handleKeyboardShortcuts(e) {
    // Esc key closes modals
    if (e.key === 'Escape') {
        closeChat();
        closeLogin();
    }
    
    // Enter key in main search
    if (e.key === 'Enter' && document.activeElement === mainSearch) {
        handleSearch();
    }
    
    // Enter key in chat input
    if (e.key === 'Enter' && document.activeElement === chatInput) {
        sendMessage();
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        mainSearch.focus();
    }
}

// Add smooth animations on load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Animate elements on page load
    const animateElements = document.querySelectorAll('.logo h1, .search-container, .feature-pills');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add mouse move effects for enhanced interactivity
document.addEventListener('mousemove', (e) => {
    const cursor = { x: e.clientX, y: e.clientY };
    
    // Subtle parallax effect on hero elements
    const heroElements = document.querySelectorAll('.column');
    heroElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (cursor.x - centerX) * 0.01;
        const deltaY = (cursor.y - centerY) * 0.01;
        
        el.style.transform += ` translate(${deltaX}px, ${deltaY}px)`;
    });
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
