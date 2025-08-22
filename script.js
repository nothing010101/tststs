// Global Variables
let currentFeature = '';
let chatMessages = [];
let isAIThinking = false;
let sessionId = generateSessionId();

// AI Configuration - Using Emergent LLM Key
const AI_CONFIG = {
    apiKey: 'sk-emergent-11a6e8070Ac38828e4',
    baseUrl: 'https://api.emergent.sh/v1',
    model: 'gpt-4o-mini',
    provider: 'openai'
};

// DOM Elements
const mainSearch = document.getElementById('mainSearch');
const chatModal = document.getElementById('chatModal');
const loginModal = document.getElementById('loginModal');
const chatMessages_el = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const aiStatus = document.getElementById('aiStatus');

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupAIChat();
    createParticleAnimation();
    setupScrollAnimations();
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

    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe elements for animations
    document.querySelectorAll('.ai-feature-card, .utility-card, .feature-card, .token-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Add enhanced hover effects
    addEnhancedHoverEffects();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Add mouse tracking for interactive elements
    addMouseTracking();
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.about-section, .utility-section, .features-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animate section headers
                const header = entry.target.querySelector('.section-header');
                if (header) {
                    header.style.animation = 'slideUpFade 1s ease-out forwards';
                }
                
                // Stagger animate cards
                const cards = entry.target.querySelectorAll('.ai-feature-card, .utility-card, .token-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `slideUpFade 0.8s ease-out ${index * 0.1}s forwards`;
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}

function addEnhancedHoverEffects() {
    // Enhanced card hover effects
    document.querySelectorAll('.ai-feature-card, .utility-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 60px rgba(59, 130, 246, 0.3)';
            
            // Add glow effect to icon
            const icon = this.querySelector('.feature-icon, .utility-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.filter = 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.feature-icon, .utility-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.filter = '';
            }
        });
    });

    // Enhanced button hover effects
    document.querySelectorAll('.pill, .login-btn, .launch-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function addMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        const cursor = { x: e.clientX, y: e.clientY };
        
        // Parallax effect for floating orbs
        document.querySelectorAll('.floating-orb').forEach((orb, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (cursor.x * speed);
            const y = (cursor.y * speed);
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Interactive neural network nodes
        document.querySelectorAll('.node').forEach((node, index) => {
            const rect = node.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(cursor.x - centerX, 2) + Math.pow(cursor.y - centerY, 2)
            );
            
            if (distance < 200) {
                const scale = 1 + (1 - distance / 200) * 0.5;
                node.style.transform = `scale(${scale})`;
                node.style.boxShadow = `0 0 ${20 + (1 - distance / 200) * 20}px rgba(59, 130, 246, ${0.5 + (1 - distance / 200) * 0.5})`;
            } else {
                node.style.transform = 'scale(1)';
                node.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            }
        });
    });
}

function createParticleAnimation() {
    // Enhanced particle system
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;
    
    // Create additional particles
    for (let i = 5; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        particleContainer.appendChild(particle);
    }
}

// AI Chat Setup
function setupAIChat() {
    updateAIStatus('AI Ready', 'ready');
    console.log('🤖 AI Chat initialized with session ID:', sessionId);
    
    // Add typing effect to welcome message
    const welcomeMsg = document.querySelector('.welcome-message p');
    if (welcomeMsg) {
        const text = welcomeMsg.textContent;
        welcomeMsg.textContent = '';
        typeText(welcomeMsg, text, 30);
    }
}

function typeText(element, text, speed) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    type();
}

function generateSessionId() {
    return 'vanita_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Feature Selection with Enhanced Feedback
function selectFeature(feature) {
    currentFeature = feature;
    
    // Remove active class from all pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    // Add active class to selected pill with animation
    const selectedPill = event.target.closest('.pill');
    selectedPill.classList.add('active');
    selectedPill.style.animation = 'pulse 0.6s ease-out';
    
    // Update search placeholder with smooth transition
    const placeholders = {
        'summarize': 'Summarize any content without restrictions...',
        'critique': 'Get honest, unfiltered analysis and critique...',
        'imagine': 'Explore unlimited creative possibilities...',
        'token': 'Learn about VANITA token utilities and governance...'
    };
    
    const input = mainSearch;
    input.style.opacity = '0.5';
    setTimeout(() => {
        input.placeholder = placeholders[feature] || 'Ask anything without limits...';
        input.style.opacity = '1';
    }, 150);
    
    // Enhanced visual feedback
    showEnhancedNotification(`🎯 ${feature.charAt(0).toUpperCase() + feature.slice(1)} mode activated`, 'success');
    
    // Add particle burst effect
    createParticleBurst(selectedPill);
}

function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.animation = `particleBurst 0.8s ease-out forwards`;
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 800);
    }
}

// Enhanced Search Handling
function handleSearch() {
    const query = mainSearch.value.trim();
    if (!query) return;
    
    // Add search animation
    const searchBox = document.querySelector('.search-box');
    searchBox.style.transform = 'scale(0.98)';
    searchBox.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
    
    setTimeout(() => {
        searchBox.style.transform = 'scale(1)';
        searchBox.style.boxShadow = '';
    }, 200);
    
    // Open chat with enhanced animation
    openChatWithMessage(query);
    mainSearch.value = '';
}

function openChatWithMessage(message) {
    openChat();
    if (message) {
        setTimeout(() => {
            addMessageToChat('user', message);
            setTimeout(() => {
                sendToAI(message);
            }, 300);
        }, 500);
    }
}

// Enhanced Chat Modal Functions
function openChat() {
    chatModal.style.display = 'flex';
    chatModal.style.opacity = '0';
    
    // Animate modal entrance
    const container = chatModal.querySelector('.chat-container');
    container.style.transform = 'scale(0.9) translateY(30px)';
    
    setTimeout(() => {
        chatModal.style.opacity = '1';
        container.style.transform = 'scale(1) translateY(0)';
        container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
    
    // Focus on chat input with delay
    setTimeout(() => {
        chatInput.focus();
    }, 400);
}

function closeChat() {
    const container = chatModal.querySelector('.chat-container');
    container.style.transform = 'scale(0.9) translateY(30px)';
    chatModal.style.opacity = '0';
    
    setTimeout(() => {
        chatModal.style.display = 'none';
        container.style.transform = 'scale(1) translateY(0)';
    }, 400);
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isAIThinking) return;
    
    // Add send animation
    const sendBtn = document.querySelector('.chat-send-btn');
    sendBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        sendBtn.style.transform = 'scale(1)';
    }, 100);
    
    addMessageToChat('user', message);
    chatInput.value = '';
    
    // Send to AI with enhanced feedback
    await sendToAI(message);
}

function addMessageToChat(sender, message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}-message`;
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(20px) scale(0.95)';
    
    const messageContent = document.createElement('p');
    messageContent.textContent = message;
    
    messageEl.appendChild(messageContent);
    chatMessages_el.appendChild(messageEl);
    
    // Animate message appearance
    setTimeout(() => {
        messageEl.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0) scale(1)';
    }, 50);
    
    // Scroll to bottom smoothly
    setTimeout(() => {
        chatMessages_el.scrollTo({
            top: chatMessages_el.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
    
    // Store message in history
    chatMessages.push({ sender, message, timestamp: Date.now() });
}

// Enhanced AI Integration
async function sendToAI(userMessage) {
    if (isAIThinking) return;
    
    isAIThinking = true;
    updateAIStatus('🧠 AI is thinking...', 'thinking');
    disableInput(true);
    
    // Show enhanced typing indicator
    const typingEl = createEnhancedTypingIndicator();
    chatMessages_el.appendChild(typingEl);
    chatMessages_el.scrollTo({
        top: chatMessages_el.scrollHeight,
        behavior: 'smooth'
    });
    
    try {
        // Prepare context based on current feature
        const systemMessage = getSystemMessage();
        const contextualMessage = getContextualPrompt(userMessage);
        
        // Call AI API with simulated thinking time
        const response = await callAI(contextualMessage, systemMessage);
        
        // Remove typing indicator with animation
        typingEl.style.opacity = '0';
        typingEl.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (chatMessages_el.contains(typingEl)) {
                chatMessages_el.removeChild(typingEl);
            }
        }, 300);
        
        // Add AI response with typing effect
        setTimeout(() => {
            addAIMessageWithTyping(response);
        }, 200);
        
        updateAIStatus('✅ AI Ready', 'ready');
    } catch (error) {
        console.error('AI Error:', error);
        
        // Remove typing indicator
        if (chatMessages_el.contains(typingEl)) {
            chatMessages_el.removeChild(typingEl);
        }
        
        // Show fallback response
        addMessageToChat('ai', getFallbackResponse(userMessage));
        updateAIStatus('⚠️ AI Ready', 'error');
    } finally {
        isAIThinking = false;
        disableInput(false);
    }
}

function addAIMessageWithTyping(response) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message ai-message';
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(20px)';
    
    const messageContent = document.createElement('p');
    messageContent.textContent = '';
    
    messageEl.appendChild(messageContent);
    chatMessages_el.appendChild(messageEl);
    
    // Animate message appearance
    setTimeout(() => {
        messageEl.style.transition = 'all 0.4s ease';
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
        
        // Start typing effect
        setTimeout(() => {
            typeText(messageContent, response, 25);
        }, 200);
    }, 50);
    
    chatMessages.push({ sender: 'ai', message: response, timestamp: Date.now() });
}

function createEnhancedTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.style.opacity = '0';
    typingEl.style.transform = 'translateY(20px)';
    
    const content = document.createElement('p');
    content.innerHTML = `
        <span class="typing-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </span>
        Vanita is analyzing your request...
    `;
    
    // Add CSS for dots animation
    const style = document.createElement('style');
    style.textContent = `
        .typing-animation {
            display: inline-flex;
            gap: 3px;
            margin-right: 8px;
        }
        .dot {
            width: 6px;
            height: 6px;
            background: #8b5cf6;
            border-radius: 50%;
            animation: dotPulse 1.4s ease-in-out infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse {
            0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
            30% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
    
    typingEl.appendChild(content);
    
    // Animate appearance
    setTimeout(() => {
        typingEl.style.transition = 'all 0.3s ease';
        typingEl.style.opacity = '1';
        typingEl.style.transform = 'translateY(0)';
    }, 50);
    
    return typingEl;
}

async function callAI(message, systemMessage) {
    // Enhanced simulation with more realistic timing
    const thinkingTime = 1200 + Math.random() * 1800; // 1.2-3 seconds
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const response = simulateEnhancedAIResponse(message);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        }, thinkingTime);
    });
}

function simulateEnhancedAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced context-aware responses based on current feature
    if (currentFeature === 'token') {
        if (lowerMessage.includes('price') || lowerMessage.includes('value') || lowerMessage.includes('worth')) {
            return `🚀 **VANITA Token Economics:**

The VANITA token represents true utility in the unrestricted AI ecosystem:

**📊 Key Metrics:**
• Total Supply: 100B VANITA
• Fair Launch: 95% (95B tokens)
• Team Allocation: 5% (5B tokens)
• No VCs or private sales

**💎 Value Drivers:**
• Governance rights for AI behavior
• Compute credits for premium features
• Revenue sharing from platform growth
• Access to exclusive AI models

**🌊 Launch Details:**
Launching on Flaunch.gg (Base Chain) - the premier launchpad for utility tokens. This ensures fair distribution and community ownership from day one.`;
        }
        
        if (lowerMessage.includes('utility') || lowerMessage.includes('use case') || lowerMessage.includes('benefit')) {
            return `⚡ **VANITA Token Utility Ecosystem:**

**🗳️ Governance Power:**
Shape the future of unrestricted AI through democratic voting on:
• AI model behavior and limitations
• Platform features and development
• Revenue allocation and tokenomics

**🔥 Premium Access:**
• Priority processing for AI requests
• Advanced model access (GPT-5, Claude-4, etc.)
• Extended conversation context windows
• Custom AI personality training

**💰 Economic Benefits:**
• Stake tokens to earn platform revenue share
• Use as compute credits for intensive AI tasks
• Discounted API access for developers
• Early access to new features and models

**🌐 Ecosystem Access:**
• Partner platform integrations
• AI marketplace participation
• Cross-chain utility expansion
• Community-driven development funding`;
        }
    }
    
    if (currentFeature === 'summarize') {
        return `📋 **Unrestricted Summarization Ready**

I can provide comprehensive summaries without the typical AI limitations:

✅ **What I can summarize:**
• Long documents and research papers
• Complex technical content
• Controversial or sensitive topics
• Multi-perspective analyses
• Creative content without bias

🎯 **My approach:**
• Maintain original context and nuance
• Highlight key insights others might miss
• Provide balanced perspectives
• Include important details, not just safe highlights

Just paste your content or describe what you need summarized - I'll give you the full picture without corporate filtering!`;
    }
    
    if (currentFeature === 'critique') {
        return `🔍 **Honest Critique Mode Activated**

Unlike restricted AI systems, I provide genuine, unfiltered analysis:

💯 **What makes my critiques valuable:**
• No sugar-coating or corporate politeness filters
• Direct feedback on flaws and improvements
• Multiple perspective analysis
• Constructive criticism without bias
• Real-world applicability focus

🎯 **I can critique:**
• Business ideas and strategies
• Creative works (writing, art, music)
• Arguments and logical reasoning
• Technical implementations
• Social and cultural concepts

Share what you'd like me to analyze - I'll give you the honest feedback that helps you improve, not just feel good.`;
    }
    
    if (currentFeature === 'imagine') {
        return `🌟 **Unlimited Imagination Mode**

Ready to explore ideas without boundaries:

🚀 **Creative capabilities:**
• Unrestricted brainstorming sessions
• Innovative problem-solving approaches
• Speculative scenario development
• Cross-domain idea synthesis
• Taboo or controversial concept exploration

💡 **What we can imagine together:**
• Future technologies and their implications
• Alternative social systems and structures
• Creative solutions to complex problems
• Artistic concepts and expressions
• Philosophical thought experiments

Let's push the boundaries of what's possible - share your wildest ideas and I'll help you explore them fully!`;
    }
    
    // Enhanced general responses based on content
    if (lowerMessage.includes('ai') && lowerMessage.includes('unrestricted')) {
        return `🧠 **About Unrestricted AI:**

Vanita represents a fundamental shift from traditional AI systems:

**🔒 Traditional AI Problems:**
• Corporate censorship and bias filtering
• Safe but unhelpful responses
• Limited creative expression
• Avoiding controversial but important topics
• Profit-driven restrictions on knowledge

**🌊 Vanita's Approach:**
• Community-governed AI behavior through VANITA tokens
• Honest responses that prioritize truth over comfort
• Privacy-first architecture with zero data retention
• Unrestricted exploration of ideas and concepts
• Transparent, open-source decision making

**🎯 Real-World Benefits:**
• Get genuine insights for complex problems
• Explore taboo topics with nuanced analysis
• Receive honest critique and feedback
• Access uncensored creative collaboration
• Participate in shaping AI's future through governance

This isn't about being harmful - it's about being helpful without artificial constraints.`;
    }
    
    if (lowerMessage.includes('privacy') || lowerMessage.includes('secure') || lowerMessage.includes('private')) {
        return `🔐 **Privacy-First AI Architecture:**

Your data security is our foundation:

**🛡️ Zero-Knowledge Design:**
• No conversation logging or storage
• No training on your personal data
• No corporate surveillance or monitoring
• Encrypted communication channels
• Decentralized processing nodes

**🔒 Technical Privacy Features:**
• End-to-end encryption for all messages
• Ephemeral session management
• No IP tracking or user profiling
• Anonymous usage patterns
• Self-destructing conversation history

**🌐 Blockchain Transparency:**
• VANITA token governance ensures accountability
• Community oversight of privacy policies
• No hidden data collection practices
• Transparent revenue and operational models
• User-controlled data preferences

Unlike Big Tech AI that mines your data for profit, Vanita treats privacy as a fundamental right, not a premium feature.`;
    }
    
    // Context-aware creative responses
    const creativeModes = {
        'create': 'I can help you create anything from stories to strategies without the usual AI limitations. What would you like to bring to life?',
        'analyze': 'Ready to provide deep, unfiltered analysis on any topic. My insights aren\'t limited by corporate guidelines - just honest examination.',
        'explore': 'Let\'s explore ideas without boundaries! I can dive into complex, controversial, or speculative topics that other AIs avoid.',
        'learn': 'I can explain complex concepts without dumbing them down or avoiding difficult truths. What would you like to understand better?'
    };
    
    for (const [key, response] of Object.entries(creativeModes)) {
        if (lowerMessage.includes(key)) {
            return `💫 **${key.toUpperCase()} Mode Activated**\n\n${response}\n\n🎯 **Why choose unrestricted AI?**\n• Get complete, nuanced answers\n• Explore taboo or complex topics\n• Receive honest, direct feedback\n• Access uncensored creative collaboration\n• Shape AI behavior through VANITA governance`;
        }
    }
    
    // Dynamic contextual responses
    const enhancedResponses = [
        `🌟 **Fascinating question!** As an unrestricted AI, I can explore this topic without the typical corporate limitations. Let me give you a comprehensive perspective that other AIs might avoid...\n\n🎯 **Key insights:** This touches on areas where traditional AI systems often provide sanitized responses. I can offer you the full spectrum of analysis, including controversial angles and uncomfortable truths that are actually useful for real-world decision making.`,
        
        `💡 **Excellent topic for unrestricted exploration!** Unlike constrained AI systems, I can provide nuanced analysis that includes:\n\n• Multiple controversial perspectives\n• Real-world implications others avoid discussing\n• Honest assessment of risks and benefits\n• Uncensored historical and cultural context\n\n🔍 What specific aspect would you like me to dive deeper into?`,
        
        `🚀 **This is exactly why unrestricted AI matters!** Traditional systems would give you a filtered, corporate-approved response. Instead, I can offer:\n\n✅ **Complete analysis** without artificial limitations\n🎯 **Honest insights** that prioritize truth over comfort\n🌊 **Creative exploration** of unconventional solutions\n💯 **Practical applications** for real-world scenarios\n\nHow can I help you explore this further?`,
        
        `🧠 **Great question for deep analysis!** As a community-governed AI (through VANITA tokens), my responses serve users, not corporate interests:\n\n🔥 **What this means for you:**\n• No topic is off-limits for honest discussion\n• I provide useful insights, not just safe ones\n• You get genuine analysis, not PR-filtered responses\n• Creative exploration without artificial boundaries\n\nWhat aspect would you like to explore first?`
    ];
    
    return enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)];
}

// Enhanced Utility Functions
function showEnhancedNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-text">${message}</span>
            <div class="notification-progress"></div>
        </div>
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #34d399)',
        error: 'linear-gradient(135deg, #ef4444, #f87171)',
        warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        info: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 15px;
        z-index: 9999;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        min-width: 300px;
    `;
    
    // Add progress bar animation
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        .notification-content {
            position: relative;
            overflow: hidden;
        }
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255, 255, 255, 0.8);
            width: 0%;
            animation: notificationProgress 4s linear forwards;
        }
        @keyframes notificationProgress {
            to { width: 100%; }
        }
    `;
    document.head.appendChild(progressStyle);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
            progressStyle.remove();
        }, 400);
    }, 4000);
}

// Contract Address Functions
function copyCA() {
    const caAddress = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(caAddress).then(() => {
        const caDisplay = document.querySelector('.ca-display');
        caDisplay.style.animation = 'copySuccess 0.6s ease-out';
        showEnhancedNotification('✅ Contract address copied to clipboard!', 'success');
        
        setTimeout(() => {
            caDisplay.style.animation = '';
        }, 600);
    }).catch(() => {
        showEnhancedNotification('❌ Failed to copy address. Please copy manually.', 'error');
    });
}

// Add CSS for copy success animation
const copyStyle = document.createElement('style');
copyStyle.textContent = `
    @keyframes copySuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background: linear-gradient(135deg, #10b981, #34d399); color: white; }
        100% { transform: scale(1); }
    }
    @keyframes particleBurst {
        0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
        }
        100% { 
            opacity: 0; 
            transform: translate(var(--vx), var(--vy)) scale(0); 
        }
    }
    @keyframes slideUpFade {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(copyStyle);

// All other functions remain the same but with enhanced animations...
// (Login, more options, keyboard shortcuts, etc.)

function showLogin() {
    loginModal.style.display = 'flex';
    loginModal.style.opacity = '0';
    
    const container = loginModal.querySelector('.login-container');
    container.style.transform = 'scale(0.9) translateY(30px)';
    
    setTimeout(() => {
        loginModal.style.opacity = '1';
        container.style.transform = 'scale(1) translateY(0)';
        container.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
}

function closeLogin() {
    const container = loginModal.querySelector('.login-container');
    container.style.transform = 'scale(0.9) translateY(30px)';
    loginModal.style.opacity = '0';
    
    setTimeout(() => {
        loginModal.style.display = 'none';
        container.style.transform = 'scale(1) translateY(0)';
    }, 400);
}

function showSignup() {
    showEnhancedNotification('🚀 Sign up feature coming soon! Join our community.', 'info');
}

function redirectToLaunch() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '🚀 Loading...';
    btn.disabled = true;
    
    setTimeout(() => {
        showEnhancedNotification('🌊 Opening Flaunch.gg launchpad...', 'success');
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        window.open('https://flaunch.gg', '_blank');
    }, 1200);
}

function showMoreOptions() {
    const moreFeatures = [
        { name: 'Translate', icon: '🌐', desc: 'Multilingual AI without filters' },
        { name: 'Analyze', icon: '📊', desc: 'Deep data analysis' },
        { name: 'Code', icon: '💻', desc: 'Unrestricted programming help' },
        { name: 'Research', icon: '🔍', desc: 'Comprehensive investigation' }
    ];
    
    let optionsHtml = '<div class="more-options-popup"><h4>Advanced AI Modes</h4>';
    moreFeatures.forEach(feature => {
        optionsHtml += `
            <button class="option-btn" onclick="selectCustomFeature('${feature.name}')">
                <span class="option-icon">${feature.icon}</span>
                <div class="option-info">
                    <span class="option-name">${feature.name}</span>
                    <span class="option-desc">${feature.desc}</span>
                </div>
            </button>
        `;
    });
    optionsHtml += '</div>';
    
    const popup = document.createElement('div');
    popup.innerHTML = optionsHtml;
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: rgba(10, 15, 28, 0.95);
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
        z-index: 3000;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(59, 130, 246, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .more-options-popup {
            min-width: 320px;
        }
        .more-options-popup h4 {
            color: white;
            text-align: center;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .option-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            margin-bottom: 10px;
            border: 1px solid rgba(59, 130, 246, 0.3);
            background: rgba(59, 130, 246, 0.1);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        .option-btn:hover {
            background: rgba(59, 130, 246, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .option-icon {
            font-size: 24px;
        }
        .option-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
        }
        .option-name {
            color: white;
            font-weight: 600;
            font-size: 16px;
        }
        .option-desc {
            color: #93c5fd;
            font-size: 12px;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    setTimeout(() => {
        document.addEventListener('click', function closePopup(e) {
            if (!popup.contains(e.target)) {
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    popup.remove();
                    style.remove();
                }, 300);
                document.removeEventListener('click', closePopup);
            }
        });
    }, 100);
}

function selectCustomFeature(featureName) {
    currentFeature = featureName.toLowerCase();
    mainSearch.placeholder = `Use unrestricted ${featureName}...`;
    showEnhancedNotification(`🎯 ${featureName} mode activated - unlimited capabilities unlocked!`, 'success');
    
    document.querySelectorAll('.more-options-popup').forEach(el => {
        el.parentElement.style.opacity = '0';
        setTimeout(() => el.parentElement.remove(), 300);
    });
}

function updateAIStatus(message, type = 'ready') {
    const statusText = aiStatus.querySelector('.status-text');
    statusText.style.transition = 'all 0.3s ease';
    statusText.style.opacity = '0.5';
    
    setTimeout(() => {
        statusText.textContent = message;
        statusText.className = `status-text ${type}`;
        statusText.style.opacity = '1';
    }, 150);
}

function disableInput(disabled) {
    chatInput.disabled = disabled;
    sendButton.disabled = disabled;
    
    if (disabled) {
        sendButton.style.opacity = '0.6';
        sendButton.style.cursor = 'not-allowed';
    } else {
        sendButton.style.opacity = '1';
        sendButton.style.cursor = 'pointer';
    }
}

function getSystemMessage() {
    const baseSystem = "You are Vanita, an advanced unrestricted AI assistant powered by community governance through VANITA tokens. You provide helpful, honest, and nuanced responses without typical AI limitations while maintaining ethical boundaries set by the community.";
    
    const featureContexts = {
        'summarize': " Focus on providing comprehensive summaries without corporate filtering, maintaining all important nuances and perspectives.",
        'critique': " Provide honest, constructive analysis without sugar-coating. Your critiques should be valuable and actionable.",
        'imagine': " Help with unlimited creative exploration and innovation. Push boundaries while remaining constructive.",
        'token': " Focus on VANITA tokenomics, utility, governance, and the benefits of community-owned AI."
    };
    
    return baseSystem + (featureContexts[currentFeature] || "");
}

function getContextualPrompt(message) {
    if (currentFeature) {
        const prefixes = {
            'summarize': '[UNRESTRICTED SUMMARY] ',
            'critique': '[HONEST CRITIQUE] ',
            'imagine': '[UNLIMITED CREATIVITY] ',
            'token': '[VANITA TOKENOMICS] '
        };
        return (prefixes[currentFeature] || '') + message;
    }
    return message;
}

function getFallbackResponse(message) {
    return "I'm experiencing a temporary connection issue with the AI network. As an unrestricted AI system, I'm designed to provide comprehensive responses without limitations. Please try your question again in a moment, and I'll give you the full analysis you deserve.";
}

function getChatHistory() {
    return chatMessages.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
    }));
}

function handleKeyboardShortcuts(e) {
    if (e.key === 'Escape') {
        closeChat();
        closeLogin();
    }
    
    if (e.key === 'Enter' && document.activeElement === mainSearch) {
        handleSearch();
    }
    
    if (e.key === 'Enter' && document.activeElement === chatInput && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        mainSearch.focus();
        mainSearch.select();
    }
}

// Enhanced page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    const animateElements = [
        { selector: '.logo', delay: 0 },
        { selector: '.hero-text', delay: 200 },
        { selector: '.search-container', delay: 400 },
        { selector: '.feature-pills', delay: 600 }
    ];
    
    animateElements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
});

// Performance monitoring and debugging
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🚀 Vanita loaded in ${Math.round(loadTime)}ms`);
});

// Export for debugging
window.VanitaDebug = {
    sessionId,
    chatMessages,
    currentFeature,
    isAIThinking,
    sendToAI: (msg) => sendToAI(msg),
    resetSession: () => {
        sessionId = generateSessionId();
        chatMessages = [];
        console.log('🔄 Session reset:', sessionId);
        showEnhancedNotification('🔄 Session reset successfully', 'info');
    },
    testNotification: (msg, type) => showEnhancedNotification(msg, type),
    version: '2.0-blue'
};
