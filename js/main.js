// Configuration de l'année en cours dans le footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Header sticky avec effet de défilement
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Animation au défilement
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observer les sections pour l'animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Animation des cartes de service au défilement
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-fade-in');
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

serviceCards.forEach(card => {
    serviceObserver.observe(card);
});

// Gestion des liens d'ancrage fluides
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});


// Responsive : géré par CSS désormais
function handleResponsiveNav() {
    // La gestion responsive est maintenant effectuée via CSS media queries
    // Cette fonction est conservée vide pour éviter les erreurs si elle est appelée ailleurs
}

// Initialiser le responsive
// window.addEventListener('load', handleResponsiveNav);
// window.addEventListener('resize', handleResponsiveNav);


// Initialiser l'animation au chargement
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animer les éléments de la hero section
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-cta, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ============================================
// FONCTIONNALITÉS INTERACTIVES PRICING
// ============================================

// Calculateur de prix dynamique
const initPricingCalculator = () => {
    const usersSlider = document.getElementById('users-slider');
    const projectsSlider = document.getElementById('projects-slider');
    const storageSlider = document.getElementById('storage-slider');
    
    const usersCount = document.getElementById('users-count');
    const projectsCount = document.getElementById('projects-count');
    const storageCount = document.getElementById('storage-count');
    
    const calcUsers = document.getElementById('calc-users');
    const calcProjects = document.getElementById('calc-projects');
    const calcStorage = document.getElementById('calc-storage');
    const calculatedPrice = document.getElementById('calculated-price');
    
    if (!usersSlider || !projectsSlider || !storageSlider) return;
    
    const updateCalculator = () => {
        const users = parseInt(usersSlider.value);
        const projects = parseInt(projectsSlider.value);
        const storage = parseInt(storageSlider.value);
        
        // Mise à jour des affichages
        usersCount.textContent = users;
        projectsCount.textContent = projects;
        storageCount.textContent = storage;
        calcUsers.textContent = `${users} utilisateurs`;
        calcProjects.textContent = `${projects} projets`;
        calcStorage.textContent = `${storage} GB stockage`;
        
        // Calcul du prix (formule personnalisée)
        let basePrice = 29; // Prix de base
        let totalPrice = basePrice;
        
        // Calcul basé sur les utilisateurs
        if (users <= 5) {
            totalPrice += 0; // Inclus dans le plan de base
        } else if (users <= 25) {
            totalPrice += (users - 5) * 3; // 3€ par utilisateur supplémentaire jusqu'à 25
        } else {
            totalPrice += (25 - 5) * 3 + (users - 25) * 2; // Puis 2€ par utilisateur
        }
        
        // Calcul basé sur les projets
        if (projects <= 10) {
            totalPrice += 0; // Inclus dans le plan de base
        } else if (projects <= 50) {
            totalPrice += (projects - 10) * 2; // 2€ par projet supplémentaire
        } else {
            totalPrice += (50 - 10) * 2 + (projects - 50) * 1; // Puis 1€ par projet
        }
        
        // Calcul basé sur le stockage
        if (storage <= 10) {
            totalPrice += 0; // Inclus dans le plan de base
        } else if (storage <= 100) {
            totalPrice += (storage - 10) * 0.5; // 0.5€ par GB supplémentaire
        } else {
            totalPrice += (100 - 10) * 0.5 + (storage - 100) * 0.3; // Puis 0.3€ par GB
        }
        
        // Arrondir et afficher
        calculatedPrice.textContent = Math.round(totalPrice);
        
        // Animation du changement de prix
        calculatedPrice.style.transform = 'scale(1.1)';
        setTimeout(() => {
            calculatedPrice.style.transform = 'scale(1)';
        }, 200);
    };
    
    // Event listeners pour les sliders
    usersSlider.addEventListener('input', updateCalculator);
    projectsSlider.addEventListener('input', updateCalculator);
    storageSlider.addEventListener('input', updateCalculator);
    
    // Calcul initial
    updateCalculator();
};

// Toggle mensuel/annuel
const initPricingToggle = () => {
    const pricingOptions = document.querySelectorAll('.pricing-option');
    const priceValues = document.querySelectorAll('.price-value');
    
    if (pricingOptions.length === 0) return;
    
    pricingOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Retirer la classe active de toutes les options
            pricingOptions.forEach(opt => opt.classList.remove('active'));
            
            // Ajouter la classe active à l'option cliquée
            option.classList.add('active');
            
            const billingType = option.dataset.billing;
            
            // Mettre à jour tous les prix
            priceValues.forEach(priceEl => {
                const monthlyPrice = priceEl.dataset.monthly;
                const yearlyPrice = priceEl.dataset.yearly;
                
                if (billingType === 'yearly') {
                    priceEl.textContent = yearlyPrice;
                } else {
                    priceEl.textContent = monthlyPrice;
                }
            });
            
            // Animation de changement
            priceValues.forEach(priceEl => {
                priceEl.style.transform = 'scale(1.1)';
                priceEl.style.color = 'var(--primary-color)';
                setTimeout(() => {
                    priceEl.style.transform = 'scale(1)';
                    priceEl.style.color = '';
                }, 300);
            });
        });
    });
};

// Animations des cartes de pricing
const initPricingCards = () => {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('featured')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
            card.style.boxShadow = '';
        });
    });
};

// Initialiser les fonctionnalités pricing au chargement
document.addEventListener('DOMContentLoaded', () => {
    initPricingCalculator();
    initPricingToggle();
    initPricingCards();
    
    // Animation des boutons CTA
    document.querySelectorAll('.pricing-cta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Effet de feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
});
