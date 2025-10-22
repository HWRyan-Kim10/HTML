// Smooth scrolling for navigation links
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

// Create scroll progress indicator
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            entry.target.classList.remove('loading');
        }
    });
}, observerOptions);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Create scroll indicator
    createScrollIndicator();

    // Observe all country cards and dish items
    const cards = document.querySelectorAll('.country-card, .dish-item, .stat-card');
    
    // Set initial state
    cards.forEach(card => {
        card.classList.add('loading');
        observer.observe(card);
    });

    // Add hover effects for dish items
    const dishItems = document.querySelectorAll('.dish-item');
    dishItems.forEach(dish => {
        dish.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('.continent-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.background = '';
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.style.background = 'rgba(255, 255, 255, 0.2)';
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call

    // Animated counter for stats
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    };

    // Observe stats section for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat) => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, target);
                    }, 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Add filter functionality for popular vs niche dishes
    const addFilterToggle = () => {
        const continentSections = document.querySelectorAll('.continent-section');
        
        continentSections.forEach(section => {
            const header = section.querySelector('.continent-header');
            if (!header) return;

            const filterContainer = document.createElement('div');
            filterContainer.className = 'filter-container';
            filterContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin-top: 20px;
                justify-content: center;
            `;

            const buttons = [
                { text: 'All Dishes', filter: 'all' },
                { text: '⭐ Popular', filter: 'popular' },
                { text: '💎 Hidden Gems', filter: 'niche' }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.className = 'filter-btn';
                button.style.cssText = `
                    padding: 10px 20px;
                    border: 2px solid var(--primary-color);
                    background: ${btn.filter === 'all' ? 'var(--primary-color)' : 'white'};
                    color: ${btn.filter === 'all' ? 'white' : 'var(--primary-color)'};
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    font-family: 'Poppins', sans-serif;
                `;

                button.addEventListener('click', () => {
                    // Update button styles
                    filterContainer.querySelectorAll('button').forEach(b => {
                        b.style.background = 'white';
                        b.style.color = 'var(--primary-color)';
                    });
                    button.style.background = 'var(--primary-color)';
                    button.style.color = 'white';

                    // Filter dishes
                    const dishes = section.querySelectorAll('.dish-item');
                    dishes.forEach(dish => {
                        if (btn.filter === 'all') {
                            dish.style.display = 'block';
                        } else {
                            dish.style.display = dish.classList.contains(btn.filter) ? 'block' : 'none';
                        }
                    });
                });

                button.addEventListener('mouseenter', () => {
                    if (button.style.background !== 'var(--primary-color)') {
                        button.style.background = 'var(--light-bg)';
                    }
                });

                button.addEventListener('mouseleave', () => {
                    if (button.style.color === 'var(--primary-color)') {
                        button.style.background = 'white';
                    }
                });

                filterContainer.appendChild(button);
            });

            header.appendChild(filterContainer);
        });
    };

    // Add the filter toggle functionality
    addFilterToggle();

    // Count dishes by type
    const countDishes = () => {
        const popular = document.querySelectorAll('.dish-item.popular').length;
        const niche = document.querySelectorAll('.dish-item.niche').length;
        console.log(`📊 Dishes loaded: ${popular} popular, ${niche} hidden gems, ${popular + niche} total`);
    };

    countDishes();

    // Add search functionality
    const addSearchBar = () => {
        const nav = document.querySelector('nav');
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            position: relative;
            margin-top: 15px;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Search dishes or countries...';
        searchInput.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            width: 300px;
            font-family: 'Poppins', sans-serif;
            outline: none;
        `;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase();
                
                document.querySelectorAll('.country-card').forEach(card => {
                    const countryName = card.querySelector('.country-header h3').textContent.toLowerCase();
                    const dishes = card.querySelectorAll('.dish-item');
                    let hasMatch = false;

                    if (countryName.includes(searchTerm)) {
                        card.style.display = 'block';
                        dishes.forEach(dish => dish.style.display = 'block');
                        hasMatch = true;
                    } else {
                        dishes.forEach(dish => {
                            const dishText = dish.textContent.toLowerCase();
                            if (dishText.includes(searchTerm)) {
                                dish.style.display = 'block';
                                hasMatch = true;
                            } else {
                                dish.style.display = 'none';
                            }
                        });
                    }

                    card.style.display = hasMatch || searchTerm === '' ? 'block' : 'none';
                });
            }, 300);
        });

        searchContainer.appendChild(searchInput);
        nav.appendChild(searchContainer);
    };

    addSearchBar();
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('.continent-section'));
        const currentScroll = window.pageYOffset;
        
        if (e.key === 'ArrowDown') {
            const nextSection = sections.find(section => section.offsetTop > currentScroll + 100);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            const prevSection = sections.reverse().find(section => section.offsetTop < currentScroll - 100);
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});
