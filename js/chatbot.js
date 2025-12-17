// ==========================================================================
// CHATBOT ASSISTANT - Assistant Virtuel Intelligent
// ==========================================================================

class ChatbotAssistant {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.knowledgeBase = this.initKnowledgeBase();
        
        this.init();
    }
    
    init() {
        this.createChatbotUI();
        this.bindEvents();
        this.showWelcomeMessage();
    }
    
    initKnowledgeBase() {
        return {
            greetings: [
                "Bonjour ! Je suis l'assistant FlowStack. Comment puis-je vous aider ?",
                "Salut ! Je suis là pour répondre à vos questions sur FlowStack.",
                "Hello ! Que puis-je faire pour vous aujourd'hui ?"
            ],
            features: {
                "automatisation": "FlowStack offre une automatisation avancée avec l'IA qui peut réduire vos tâches répétitives de 80% !",
                "intégrations": "Nous intégrons avec 100+ outils : Slack, Salesforce, Google Workspace, Microsoft 365, et bien plus !",
                "sécurité": "La sécurité est notre priorité : chiffrement AES-256, conformité RGPD, authentification 2FA.",
                "tarifs": "Nos tarifs starts à partir de 29€/mois. Essai gratuit 30 jours sans engagement !",
                "support": "Notre support est disponible 24/7 par chat, email et téléphone. Temps de réponse moyen : 2 minutes."
            },
            faq: {
                "combien de temps pour la mise en place": "La mise en place se fait en moins de 15 minutes ! Notre équipe vous accompagne.",
                "migration des données": "Nous nous occupons de tout ! Migration gratuite et sécurisée de vos données existantes.",
                "formation de l'équipe": "Formation incluse avec webinars, documentation et support dédié.",
                "annuler l'abonnement": "Vous pouvez annuler à tout moment depuis votre dashboard. Aucun engagement."
            },
            default: "Je suis désolé, je n'ai pas compris. Pouvez-vous reformuler votre question ? Ou contactez notre support à support@flowstack.com"
        };
    }
    
    createChatbotUI() {
        // Container principal
        const chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        chatbotContainer.innerHTML = `
            <!-- Toggle Button -->
            <button class="chatbot-toggle" id="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="chatbot-pulse"></span>
            </button>
            
            <!-- Chat Window -->
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-info">
                        <h3>Assistant FlowStack</h3>
                        <span class="status">En ligne</span>
                    </div>
                    <button class="chatbot-close" id="chatbot-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Bonjour ! Je suis votre assistant virtuel FlowStack. Comment puis-je vous aider ?</p>
                            <span class="message-time">${this.getCurrentTime()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="chatbot-input-container">
                    <div class="quick-actions">
                        <button class="quick-action" data-question="fonctionnalités">Fonctionnalités</button>
                        <button class="quick-action" data-question="tarifs">Tarifs</button>
                        <button class="quick-action" data-question="démo">Voir une démo</button>
                    </div>
                    <div class="chatbot-input-wrapper">
                        <input type="text" id="chatbot-input" placeholder="Tapez votre message..." maxlength="500">
                        <button id="chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatbotContainer);
    }
    

    bindEvents() {
        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const quickActions = document.querySelectorAll('.quick-action');
        const messagesContainer = document.getElementById('chatbot-messages');
        
        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        
        // Send message on Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        send.addEventListener('click', () => this.sendMessage());
        
        // Quick actions
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const question = action.dataset.question;
                input.value = question;
                this.sendMessage();
            });
        });
        
        // Scroll events
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', () => this.handleScroll());
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            const container = document.querySelector('.chatbot-container');
            if (!container.contains(e.target) && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        const window = document.getElementById('chatbot-window');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        window.style.display = 'block';
        window.style.opacity = '0';
        window.style.transform = 'translateY(20px) scale(0.9)';
        
        // Animation d'ouverture
        setTimeout(() => {
            window.style.transition = 'all 0.3s ease';
            window.style.opacity = '1';
            window.style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        this.isOpen = true;
        toggle.classList.add('active');
        
        // Focus sur l'input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 350);
    }
    
    closeChat() {
        const window = document.getElementById('chatbot-window');
        const toggle = document.getElementById('chatbot-toggle');
        
        window.style.transition = 'all 0.3s ease';
        window.style.opacity = '0';
        window.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            window.style.display = 'none';
        }, 300);
        
        this.isOpen = false;
        toggle.classList.remove('active');
    }
    
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Ajouter le message utilisateur
        this.addUserMessage(message);
        input.value = '';
        
        // Simuler la frappe
        this.showTyping();
        
        // Traitement de la réponse
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message.toLowerCase());
            this.addBotMessage(response);
        }, 1000 + Math.random() * 1000);
    }
    
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        messageEl.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message';
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    showTyping() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot-message typing-message';
        typingEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
        this.isTyping = true;
    }
    
    hideTyping() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
        this.isTyping = false;
    }
    
    generateResponse(userMessage) {
        // Recherche dans la base de connaissances
        for (const [key, value] of Object.entries(this.knowledgeBase.features)) {
            if (userMessage.includes(key)) {
                return value;
            }
        }
        
        for (const [key, value] of Object.entries(this.knowledgeBase.faq)) {
            if (userMessage.includes(key)) {
                return value;
            }
        }
        
        // Réponses par défaut intelligentes
        if (userMessage.includes('bonjour') || userMessage.includes('salut') || userMessage.includes('hello')) {
            return this.getRandomResponse(this.knowledgeBase.greetings);
        }
        
        if (userMessage.includes('prix') || userMessage.includes('coût') || userMessage.includes('tarif')) {
            return this.knowledgeBase.features.tarifs;
        }
        
        if (userMessage.includes('démo') || userMessage.includes('essai')) {
            return "Je serais ravi de vous montrer une démo ! Cliquez sur 'Commencer l'essai gratuit' en haut de la page pour découvrir FlowStack pendant 30 jours.";
        }
        
        return this.knowledgeBase.default;
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage("💡 Astuce : Utilisez les boutons rapides ci-dessous pour des réponses instantanées !");
        }, 2000);
    }
    

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        // Vérifier si l'utilisateur était déjà en bas avant d'ajouter un message
        const wasAtBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 20;
        
        // Ne scroller automatiquement vers le bas que si l'utilisateur était déjà en bas
        if (wasAtBottom) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
        
        // Afficher un indicateur si l'utilisateur n'est pas en bas
        this.updateScrollIndicator();
    }
    
    updateScrollIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const indicator = document.querySelector('.scroll-indicator');
        
        if (messagesContainer.scrollTop + messagesContainer.clientHeight < messagesContainer.scrollHeight - 20) {
            // L'utilisateur n'est pas en bas, afficher un indicateur
            if (!indicator) {
                const scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'scroll-indicator';
                scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i> Nouveaux messages';
                messagesContainer.appendChild(scrollIndicator);
                
                // Cliquer sur l'indicateur pour aller en bas
                scrollIndicator.addEventListener('click', () => {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    scrollIndicator.remove();
                });
            }
        } else {
            // L'utilisateur est en bas, supprimer l'indicateur
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    handleScroll() {
        const messagesContainer = document.getElementById('chatbot-messages');
        
        // Détecter si l'utilisateur fait défiler vers le haut
        if (messagesContainer.scrollTop < messagesContainer.scrollHeight - messagesContainer.clientHeight - 20) {
            messagesContainer.classList.add('scrolling-up');
        } else {
            messagesContainer.classList.remove('scrolling-up');
            
            // Supprimer l'indicateur si l'utilisateur est revenu en bas
            const indicator = document.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotAssistant();
});

// Export
window.ChatbotAssistant = ChatbotAssistant;
