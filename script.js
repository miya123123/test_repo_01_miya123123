// GameHub - Interactive JavaScript

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHeroAnimations();
    initializeScrollAnimations();
    initializeCarousel();
    initializeGenreCards();
    initializeGameCards();
    initializeParticles();
    initializeSmoothScrolling();
});

// Navigation Management
function initializeNavigation() {
    const navbar = $('.navbar');
    const hamburger = $('.hamburger');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-link');

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(13, 17, 23, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(13, 17, 23, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active link highlighting
    const sections = $$('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Hero Section Animations
function initializeHeroAnimations() {
    const heroStats = $$('.stat-number');
    
    // Animate stats counter
    const animateStats = () => {
        heroStats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const suffix = stat.textContent.replace(/[\d.]/g, '');
            let current = 0;
            const increment = target / 50;
            const isDecimal = stat.textContent.includes('.');
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
                stat.textContent = displayValue + suffix;
            }, 40);
        });
    };

    // Trigger stats animation when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 1000);
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = $('#home');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // CTA Button interaction
    const ctaButton = $('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Smooth scroll to featured games
            const featuredSection = $('#featured');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animationElements = [
        ...$$('.game-card'),
        ...$$('.genre-card'),
        ...$$('.news-card'),
        ...$$('.section-title')
    ];

    animationElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        
        fadeObserver.observe(el);
    });

    // Add fade-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Reviews Carousel
function initializeCarousel() {
    const reviewCards = $$('.review-card');
    const indicators = $$('.indicator');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        reviewCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % reviewCards.length;
        showSlide(currentSlide);
    };

    const startSlideshow = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const stopSlideshow = () => {
        clearInterval(slideInterval);
    };

    // Initialize indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopSlideshow();
            startSlideshow();
        });
    });

    // Start automatic slideshow
    if (reviewCards.length > 0) {
        startSlideshow();

        // Pause on hover
        const reviewsSection = $('.reviews-carousel');
        if (reviewsSection) {
            reviewsSection.addEventListener('mouseenter', stopSlideshow);
            reviewsSection.addEventListener('mouseleave', startSlideshow);
        }
    }
}

// Genre Cards Interaction
function initializeGenreCards() {
    const genreCards = $$('.genre-card');

    genreCards.forEach(card => {
        card.addEventListener('click', () => {
            const genre = card.dataset.genre;
            
            // Add visual feedback
            card.style.transform = 'translateY(-15px) scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);

            // Simulate genre filter (in real app, this would filter games)
            console.log(`Filtering games by genre: ${genre}`);
            
            // Show notification
            showNotification(`${card.querySelector('h3').textContent}ゲームを表示中...`);
        });

        // Add hover sound effect simulation
        card.addEventListener('mouseenter', () => {
            // In a real app, you might play a hover sound here
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Game Cards Interaction
function initializeGameCards() {
    const gameCards = $$('.game-card');
    const playButtons = $$('.play-button');

    gameCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const gameTitle = card.querySelector('h3').textContent;
                
                // Add click animation
                playButton.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    playButton.style.transform = '';
                }, 150);

                // Show game launch simulation
                showGameLauncher(gameTitle);
            });
        }

        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Floating Particles Animation
function initializeParticles() {
    const hero = $('.hero');
    if (!hero) return;

    const particlesContainer = $('.floating-particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #6c5ce7;
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: 0.6;
        animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// Add particle animation keyframes
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
        }
        25% { 
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.8;
        }
        50% { 
            transform: translateY(-40px) translateX(-5px) scale(0.9);
            opacity: 1;
        }
        75% { 
            transform: translateY(-20px) translateX(-10px) scale(1.1);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(particleStyle);

// Smooth Scrolling
function initializeSmoothScrolling() {
    const scrollLinks = $$('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = $(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for navbar height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: linear-gradient(135deg, #6c5ce7, #a29bfe);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showGameLauncher(gameTitle) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-launcher-overlay';
    
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'game-launcher-modal';
    
    modal.style.cssText = `
        background: linear-gradient(135deg, #21262d, #161b22);
        border: 1px solid #6c5ce7;
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        max-width: 400px;
        width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="color: #6c5ce7; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-gamepad"></i>
        </div>
        <h3 style="color: white; margin-bottom: 1rem; font-size: 1.5rem;">
            ${gameTitle}
        </h3>
        <p style="color: #8b949e; margin-bottom: 1.5rem;">
            ゲームを起動しています...
        </p>
        <div style="width: 100%; height: 4px; background: #21262d; border-radius: 2px; overflow: hidden; margin-bottom: 1rem;">
            <div class="progress-bar" style="height: 100%; background: linear-gradient(90deg, #6c5ce7, #a29bfe); width: 0%; transition: width 0.1s ease;"></div>
        </div>
        <button onclick="closeGameLauncher()" style="
            background: #6c5ce7;
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='#5a4fcf'" onmouseout="this.style.background='#6c5ce7'">
            キャンセル
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Animate progress bar
    const progressBar = modal.querySelector('.progress-bar');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                closeGameLauncher();
                showNotification(`${gameTitle} を起動しました！`);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 200);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeGameLauncher();
        }
    });
    
    // Store reference for cleanup
    window.currentGameLauncher = overlay;
}

function closeGameLauncher() {
    const overlay = window.currentGameLauncher;
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('.game-launcher-modal').style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(overlay);
            window.currentGameLauncher = null;
        }, 300);
    }
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Show load complete notification
        setTimeout(() => {
            showNotification('GameHub loaded successfully!');
        }, 1000);
    });
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape' && window.currentGameLauncher) {
        closeGameLauncher();
    }
    
    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const indicators = $$('.indicator');
        if (indicators.length > 0) {
            const activeIndex = Array.from(indicators).findIndex(ind => ind.classList.contains('active'));
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = activeIndex > 0 ? activeIndex - 1 : indicators.length - 1;
            } else {
                newIndex = activeIndex < indicators.length - 1 ? activeIndex + 1 : 0;
            }
            
            indicators[newIndex].click();
        }
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    // Recalculate animations and layouts if needed
    const gameCards = $$('.game-card');
    gameCards.forEach(card => {
        card.style.transform = '';
    });
});

// Export functions for global access
window.closeGameLauncher = closeGameLauncher;