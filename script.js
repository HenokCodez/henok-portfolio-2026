// ==================== Theme Management ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ==================== Navigation ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle navigation menu
navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('hidden');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.add('hidden');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[data-section]');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('data-section');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// ==================== Projects Management ====================
const projectsGrid = document.getElementById('projectsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

// Render projects
function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = '';
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);

    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        projectsGrid.appendChild(projectCard);
    });

    // Trigger scroll animation
    updateActiveNavLink();
}

// Create project card
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const techList = project.technologies
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');

    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy" decoding="async">
        </div>
        <div class="project-content">
            <span class="project-category">${project.category}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${techList}</div>
            <div class="project-footer" style="display: flex; justify-content: space-between; align-items: center;">
                <span class="project-year">${project.year}</span>
                <a href="${project.github || '#'}" target="_blank" rel="noopener noreferrer" class="github-link" title="View Source on GitHub" onclick="event.stopPropagation()" onmouseenter="this.style.color='var(--color-accent-primary)'" onmouseleave="this.style.color='var(--text-secondary)'" style="color: var(--text-secondary); transition: color var(--transition-fast); display: flex; align-items: center; justify-content: center; z-index: 20;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                </a>
            </div>
        </div>
    `;

    // Add interaction
    card.addEventListener('click', () => {
        handleProjectClick(project);
    });

    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });

    return card;
}

// Handle project click
function handleProjectClick(project) {
    if (project.link) {
        window.open(project.link, "_blank");
    }
}

// Filter projects
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter');
        renderProjects(currentFilter);
    });
});

// ==================== Smooth Scroll & Analytics ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Performance Optimization ====================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for scroll events
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

// Optimized scroll handler
const debouncedScroll = debounce(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ==================== SEO & Metadata ====================
// Update page title based on section
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[data-section]');
    let currentSection = 'Home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            const title = section.querySelector('h2');
            currentSection = title ? title.textContent : 'Home';
        }
    });

    // Update document title for accessibility (optional)
    // document.title = currentSection + ' | Fullstack Developer';
});

// ==================== Accessibility ====================
// Ensure keyboard navigation works
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.add('hidden');
    }
});

// Focus management
navLinks.forEach(link => {
    link.addEventListener('focus', () => {
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderProjects('all');
    updateActiveNavLink();

    // Preload critical images
    document.querySelectorAll('img').forEach(img => {
        img.style.willChange = 'transform';
    });

    // Add page visibility API for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations if page is hidden
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations
            document.body.style.animationPlayState = 'running';
        }
    });
});

// ==================== Error Handling ====================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Handle missing projects data gracefully
if (typeof projects === 'undefined') {
    console.warn('Projects data not loaded. Using fallback.');
    window.projects = [];
}
