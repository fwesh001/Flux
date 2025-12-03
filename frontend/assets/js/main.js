/* ============================================
   MAIN.JS - Main Application Logic
   ============================================ */

/**
 * Flux Landing Page - Main Interactions
 */

class FluxApp {
    constructor() {
        this.previewCarousel = null;
        this.currentPreviewIndex = 0;
        this.previewItems = [];
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupPreviewCarousel();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        this.setupResponsivePreview();
    }

    /**
     * Setup preview carousel/gallery
     */
    setupPreviewCarousel() {
        this.previewTrack = document.getElementById('previewTrack');
        this.carouselDotsContainer = document.getElementById('carouselDots');

        if (!this.previewTrack) return;

        this.previewItems = Array.from(this.previewTrack.querySelectorAll('.preview-item'));
        const itemCount = this.previewItems.length;

        // Create carousel dots
        this.createCarouselDots(itemCount);

        // Setup keyboard navigation
        document.addEventListener('keydown', (e) => this.handleCarouselKeyboard(e));

        // Setup touch/swipe on mobile
        this.setupCarouselTouch();
    }

    /**
     * Create carousel navigation dots
     */
    createCarouselDots(count) {
        if (!this.carouselDotsContainer) return;

        this.carouselDotsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to preview ${i + 1}`);
            dot.addEventListener('click', () => this.scrollToPreview(i));
            this.carouselDotsContainer.appendChild(dot);
        }
    }

    /**
     * Scroll to specific preview item
     */
    scrollToPreview(index) {
        if (index < 0 || index >= this.previewItems.length) return;

        this.currentPreviewIndex = index;
        const item = this.previewItems[index];

        // Scroll smoothly to item
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        // Update active dot
        this.updateCarouselDots();
    }

    /**
     * Update carousel dots active state
     */
    updateCarouselDots() {
        const dots = this.carouselDotsContainer?.querySelectorAll('.carousel-dot');
        if (!dots) return;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPreviewIndex);
        });
    }

    /**
     * Handle keyboard navigation for carousel
     */
    handleCarouselKeyboard(e) {
        if (!this.previewTrack) return;

        if (e.key === 'ArrowLeft') {
            this.scrollToPreview(Math.max(0, this.currentPreviewIndex - 1));
        } else if (e.key === 'ArrowRight') {
            this.scrollToPreview(Math.min(this.previewItems.length - 1, this.currentPreviewIndex + 1));
        }
    }

    /**
     * Setup touch/swipe support for carousel
     */
    setupCarouselTouch() {
        if (!this.previewTrack) return;

        let touchStartX = 0;
        let touchEndX = 0;

        this.previewTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        this.previewTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped left - next item
                this.scrollToPreview(Math.min(this.previewItems.length - 1, this.currentPreviewIndex + 1));
            } else {
                // Swiped right - previous item
                this.scrollToPreview(Math.max(0, this.currentPreviewIndex - 1));
            }
        }
    }

    /**
     * Setup smooth scroll behavior
     */
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * Setup intersection observer for animations
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observe feature cards and other elements
        document.querySelectorAll('.feature-card, .why-item, .preview-item').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Handle responsive carousel behavior
     */
    setupResponsivePreview() {
        const updateCarouselOnResize = () => {
            // Reset carousel position on window resize if needed
            if (window.innerWidth < 768) {
                this.scrollToPreview(0);
            }
        };

        window.addEventListener('resize', updateCarouselOnResize);
    }

    /**
     * Add loading animation to buttons
     */
    setupButtonLoading() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.hasAttribute('data-loading')) return;

                this.setAttribute('data-loading', 'true');
                const originalText = this.textContent;

                this.innerHTML = '<span class="spinner"></span>';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.removeAttribute('data-loading');
                }, 1000);
            });
        });
    }

    /**
     * Setup form validation helpers
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }

    /**
     * Utility: Track page analytics
     */
    trackEvent(eventName, eventData = {}) {
        // This would integrate with your analytics service
        console.log(`Event tracked: ${eventName}`, eventData);

        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    /**
     * Utility: Add scroll-to-top button
     */
    setupScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.id = 'scrollToTop';
        scrollButton.className = 'btn btn-primary';
        scrollButton.innerHTML = '↑ Top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: none;
            z-index: 999;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            padding: 0;
            font-size: 1.25rem;
        `;

        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.style.display = 'flex';
            } else {
                scrollButton.style.display = 'none';
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fluxApp = new FluxApp();
        
        // Optional: Uncomment to enable additional features
        // window.fluxApp.setupButtonLoading();
        // window.fluxApp.setupFormValidation();
        // window.fluxApp.setupScrollToTop();
    });
} else {
    window.fluxApp = new FluxApp();
}

/**
 * Utility Functions
 */

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add class when element comes into view
 */
function observeElementsOnScroll(selector, className) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(className);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Get URL parameters
 */
function getUrlParameter(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
