// SPA Navigation - Load pages without full reload
let isLoading = false;

async function loadPage(url) {
    // Don't intercept external links or anchor links
    if (url.includes('://') || url.startsWith('#')) {
        return false;
    }
    
    // Check if we're already on this page
    const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    if (url === currentUrl) {
        // Already on this page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }
    
    if (isLoading) {
        // If already loading, fallback to normal navigation
        window.location.href = url;
        return false;
    }
    
    isLoading = true;
    
    try {
        // Show loading state (optional - you can add a loading indicator)
        const mainContent = document.querySelector('.main-content');
        const footer = document.querySelector('.footer');
        
        if (!mainContent) {
            isLoading = false;
            // Fallback to normal navigation
            window.location.href = url;
            return false;
        }
        
        // Fetch the new page
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to load page');
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract main content and footer from the new page
        const newMainContent = doc.querySelector('.main-content');
        const newFooter = doc.querySelector('.footer');
        
        if (newMainContent) {
            // Update active nav link BEFORE content change to prevent flash
            updateActiveNavLink(url);
            
            // Store current scroll position and content height to prevent jitter
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const currentHeight = mainContent.offsetHeight;
            
            // Scroll to top immediately before transition to prevent jitter
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Add fade-out effect with visibility to prevent layout shifts
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.15s ease';
            mainContent.style.visibility = 'hidden';
            
            setTimeout(() => {
                // Replace main content
                mainContent.innerHTML = newMainContent.innerHTML;
                mainContent.className = newMainContent.className;
                
                // Replace footer if it exists
                if (newFooter && footer) {
                    footer.innerHTML = newFooter.innerHTML;
                }
                
                // Update page title
                const newTitle = doc.querySelector('title');
                if (newTitle) {
                    document.title = newTitle.textContent;
                }
                
                // Ensure scroll stays at top
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Re-initialize scripts for the new page
                initializePage();
                
                // Fade in new content with visibility
                requestAnimationFrame(() => {
                    mainContent.style.visibility = 'visible';
                    mainContent.style.opacity = '1';
                });
                
                // Update URL without reload
                window.history.pushState({ path: url }, '', url);
                
                isLoading = false;
            }, 150);
        } else {
            isLoading = false;
            // Fallback to normal navigation
            window.location.href = url;
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error loading page:', error);
        isLoading = false;
        // Fallback to normal navigation if SPA fails
        window.location.href = url;
        return false;
    }
}

function updateActiveNavLink(url) {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = url.split('/').pop() || 'index.html';

    // Update immediately without any delay or animation frame
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');

        if (linkHref === currentPage ||
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initializePage() {
    // Re-initialize fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.project-card, .skill-item, .resume-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Re-initialize hero title animation if on home page
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Reset animation state
        heroTitle.classList.remove('animate-in');
        // Trigger animation after a brief delay
        setTimeout(() => {
            heroTitle.classList.add('animate-in');
        }, 100);
    }
    
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    let url = window.location.pathname + window.location.search;
    if (url === '/' || url === '') {
        url = 'index.html';
    }
    loadPage(url);
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Prevent jitter on initial page load
    // Ensure scroll is at top on initial load
    if (window.pageYOffset > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    // Force a reflow to prevent layout shifts
    document.body.offsetHeight;
    // Intercept navigation link clicks
    document.addEventListener('click', async function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Only intercept internal navigation links (HTML pages)
        const isExternal = href.includes('://');
        const isAnchor = href.startsWith('#');
        const isMailto = href.startsWith('mailto:');
        const isHtmlPage = href.endsWith('.html') || href === 'index.html' || href === '/' || href === '';
        
        const isInternalLink = !isExternal && !isAnchor && !isMailto && isHtmlPage;
        
        if (isInternalLink) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
            
            // Load the page
            let url = href;
            if (url === '/' || url === '') {
                url = 'index.html';
            }
            
            try {
                const loaded = await loadPage(url);
                // If loadPage returns false and we're not loading, use fallback
                if (loaded === false && !isLoading) {
                    window.location.href = url;
                }
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback to normal navigation on error
                window.location.href = url;
            }
        }
    });
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        const navContainer = document.querySelector('.nav-container');
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (navContainer) {
                if (navMenu.classList.contains('active')) {
                    navContainer.classList.add('menu-open');
                } else {
                    navContainer.classList.remove('menu-open');
                }
            }
        });

        // Menu closing is now handled by the main click handler above

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                if (navContainer) {
                    navContainer.classList.remove('menu-open');
                }
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add active state to navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .resume-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Ensure no shadow on navbar (desktop and mobile)
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = 'none';

    // Hero title slide-in animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Reset animation state
        heroTitle.classList.remove('animate-in');
        // Trigger animation after a brief delay
        setTimeout(() => {
            heroTitle.classList.add('animate-in');
        }, 100);
    }

    // Logo collapse animation on scroll
    const logoText = document.querySelector('.logo-text');
    let lastScrollTop = 0;
    let isScrolling = false;

    if (logoText) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    if (scrollTop === 0) {
                        // At the very top - expand
                        logoText.classList.remove('collapsed');
                    } else {
                        // Anywhere else - collapse
                        logoText.classList.add('collapsed');
                    }
                    
                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                
                isScrolling = true;
            }
        });
    }
});

