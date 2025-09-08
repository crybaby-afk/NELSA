/**
 * NELSA Main JavaScript
 * Shared functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initStickyHeader();
    initSmoothScrolling();
    initMobileMenu();
    initRevealAnimations();
    initCountUps();
    initContactForm();
    initFAQAccordion();
    
    // Home page specific initialization
    if (document.querySelector('.hero-content')) {
        initHeroAnimation();
    }
});

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollHandler = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Initial check
    scrollHandler();
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                scrollHandler();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        // Check if the clicked element is an anchor link with a hash
        if (e.target.matches('a[href^="#"]') && 
            !e.target.hash.includes(':')) {
            e.preventDefault();
            
            const targetId = e.target.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, targetId);
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update aria-expanded attribute
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Update body scroll
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navToggle.contains(e.target) &&
            !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Intersection Observer for Reveal Animations
 */
function initRevealAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const revealElements = document.querySelectorAll('.feature-card, .service-card, .stat');
    if (!revealElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Count Up Animation for Stats
 */
function initCountUps() {
    const statElements = document.querySelectorAll('.stat-number');
    if (!statElements.length) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                
                if (prefersReducedMotion) {
                    element.textContent = target;
                    return;
                }
                
                let start = 0;
                const increment = target / (duration / 16); // 60fps
                
                const updateCount = () => {
                    start += increment;
                    if (start < target) {
                        element.textContent = Math.ceil(start);
                        requestAnimationFrame(updateCount);
                    } else {
                        element.textContent = target;
                    }
                };
                
                updateCount();
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const toast = document.getElementById('toast');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = this.elements.name.value.trim();
        const email = this.elements.email.value.trim();
        const subject = this.elements.subject.value.trim();
        const message = this.elements.message.value.trim();
        
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showToast('Your message has been sent successfully! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showToast(message, type = 'success') {
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Toggle aria-expanded attribute
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle answer visibility
            answer.classList.toggle('active');
        });
    });
}

/**
 * Hero Text Animation (Home Page Only)
 */
function initHeroAnimation() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
}

/**
 * Handle images that might fail to load
 */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Keep layout intact even if image fails to load
            this.style.display = 'none';
        });
    });
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initStickyHeader,
        initSmoothScrolling,
        initMobileMenu,
        initRevealAnimations,
        initCountUps,
        initContactForm,
        initFAQAccordion,
        initHeroAnimation
    };
}