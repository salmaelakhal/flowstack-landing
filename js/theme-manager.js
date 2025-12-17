// ==========================================================================
// THEME MANAGER - Dark/Light Mode avec Persistance
// ==========================================================================

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themes = {
            light: {
                name: 'Clair',
                icon: 'fas fa-sun',
                colors: {
                    primary: '#6366f1',
                    primaryDark: '#4f46e5',
                    secondary: '#10b981',
                    background: '#ffffff',
                    surface: '#f8fafc',
                    text: '#1e293b',
                    textSecondary: '#64748b'
                }
            },
            dark: {
                name: 'Sombre',
                icon: 'fas fa-moon',
                colors: {
                    primary: '#8b5cf6',
                    primaryDark: '#7c3aed',
                    secondary: '#06b6d4',
                    background: '#0f172a',
                    surface: '#1e293b',
                    text: '#f1f5f9',
                    textSecondary: '#cbd5e1'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.createThemeToggle();
        this.bindEvents();
        this.applyTheme(this.currentTheme);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('flowstack-theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else {
            // Détecter la préférence système
            this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    }
    

    createThemeToggle() {
        // Essayer plusieurs sélecteurs pour trouver la navbar
        const navbar = document.querySelector('.navbar') || document.querySelector('nav') || document.querySelector('.header .nav-buttons');
        
        if (!navbar) {
            console.warn('Navbar non trouvée, création du bouton de thème dans le body');
            // Créer un conteneur fixe si la navbar n'est pas trouvée
            const floatingToggle = document.createElement('div');
            floatingToggle.className = 'theme-toggle-floating';
            floatingToggle.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;
            floatingToggle.innerHTML = `
                <button class="theme-toggle" id="theme-toggle" aria-label="Changer de thème">
                    <span class="theme-icon">
                        <i class="${this.themes[this.currentTheme].icon}"></i>
                    </span>
                    <span class="theme-text">${this.themes[this.currentTheme].name}</span>
                </button>
            `;
            document.body.appendChild(floatingToggle);
            return;
        }
        
        // Insérer avant les boutons de navigation
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        
        toggleContainer.innerHTML = `
            <button class="theme-toggle" id="theme-toggle" aria-label="Changer de thème">
                <span class="theme-icon">
                    <i class="${this.themes[this.currentTheme].icon}"></i>
                </span>
                <span class="theme-text">${this.themes[this.currentTheme].name}</span>
            </button>
        `;
        
        // Insérer avant les nav-buttons
        const navButtons = navbar.querySelector('.nav-buttons');
        if (navButtons) {
            navbar.insertBefore(toggleContainer, navButtons);
        } else {
            navbar.appendChild(toggleContainer);
        }
    }
    

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) {
            console.error('Bouton de thème non trouvé');
            return;
        }
        
        toggle.addEventListener('click', () => this.toggleTheme());
        
        // Écouter les changements de préférence système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('flowstack-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Debug: afficher l'état actuel
        console.log('Theme Manager initialisé:', this.currentTheme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        if (!this.themes[theme]) return;
        
        this.currentTheme = theme;
        localStorage.setItem('flowstack-theme', theme);
        this.applyTheme(theme);
        this.updateToggleUI(theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme, colors: this.themes[theme].colors }
        }));
    }
    
    applyTheme(theme) {
        const colors = this.themes[theme].colors;
        const root = document.documentElement;
        
        // Appliquer les variables CSS
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--primary-dark', colors.primaryDark);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--background-color', colors.background);
        root.style.setProperty('--surface-color', colors.surface);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--text-secondary-color', colors.textSecondary);
        

        // Ajouter classe pour le thème
        document.body.classList.remove('light-theme', 'dark-theme', 'dark', 'light');
        document.body.classList.add(`${theme}-theme`);
        
        // Compatibilité avec les variables CSS existantes
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.add('light');
        }
        
        // Animation de transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    updateToggleUI(theme) {
        const toggle = document.getElementById('theme-toggle');
        const icon = toggle.querySelector('.theme-icon i');
        const text = toggle.querySelector('.theme-text');
        
        // Animation de rotation de l'icône
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            icon.className = this.themes[theme].icon;
            text.textContent = this.themes[theme].name;
            icon.style.transform = 'rotate(0deg)';
        }, 250);
    }
    
    // Méthodes utilitaires
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    getThemeColors() {
        return this.themes[this.currentTheme].colors;
    }
}

// Initialisation automatique
let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

// Export pour utilisation globale
window.ThemeManager = ThemeManager;
