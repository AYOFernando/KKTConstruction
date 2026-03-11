/**
 * main.js - Handles dynamic content loading for KKT Constructions
 */

let currentSlide = 0;
let slideInterval;
let currentProjIndex = 0;
let projectsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let config;

        // Try fetching config.json from server/GitHub first
        try {
            const res = await fetch('./config.json');
            if (res.ok) {
                config = await res.json();
                console.log('Loaded config from config.json');
            }
        } catch (err) {
            console.log('config.json not found or server offline, checking localStorage');
        }

        // Fallback to localStorage if no config.json
        if (!config) {
            const configItem = localStorage.getItem('kkt_site_config');
            if (configItem) {
                config = JSON.parse(configItem);
                console.log('Loaded config from localStorage');
            }
        }

        if (config) {
            loadDynamicContent(config);
        } else {
            // Load defaults if no config exists anywhere
            console.log('No config found, loading defaults');
            loadDynamicContent({
                services: [
                    { img: 'hero-bg.jpg', title: 'House Constructions', desc: 'Quality craftsmanship for your dream home.' },
                    { img: 'hero-bg.jpg', title: 'Building Constructions', desc: 'Expert solutions for commercial projects.' },
                    { img: 'hero-bg.jpg', title: 'House Plan', desc: 'Professional architectural designs.' }
                ],
                projects: [
                    { img: 'hero-bg.jpg', title: 'Example Project 1', loc: 'Colombo, Sri Lanka' },
                    { img: 'hero-bg.jpg', title: 'Example Project 2', loc: 'Kandy, Sri Lanka' },
                    { img: 'hero-bg.jpg', title: 'Example Project 3', loc: 'Galle, Sri Lanka' }
                ]
            });
        }

    } catch (e) {
        console.error('Error loading config:', e);
    }
});

function loadDynamicContent(config) {
    if (!config) return;

    // Update Hero Slideshow
    const heroSlider = document.getElementById('hero-slider');
    const dotsContainer = document.getElementById('slideshow-dots');

    // Filter out invalid or empty images
    const heroImages = (config.heroImages || [])
        .filter(img => img && img.trim() !== '')
        .concat(config.heroImage && !config.heroImages ? [config.heroImage] : []);

    if (heroImages.length > 0) {
        if (heroSlider && dotsContainer) {
            heroSlider.innerHTML = '';
            dotsContainer.innerHTML = '';

            heroImages.forEach((imgSrc, index) => {
                // Create slide
                const slide = document.createElement('div');
                slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Construction Slide ${index + 1}`;
                img.className = 'full-hero-img';
                slide.appendChild(img);
                heroSlider.appendChild(slide);

                // Create dot
                const dot = document.createElement('div');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.onclick = () => goToSlide(index);
                dotsContainer.appendChild(dot);
            });

            currentSlide = 0; // Reset to first slide on load
            startSlideshow();
        }
    } else {
        // Fallback to default if nothing is configured
        console.log('No hero images found in config');
    }

    // Update Hero Title
    if (config.heroTitle) {
        const heroTitle = document.getElementById('dynamic-hero-title');
        if (heroTitle) {
            heroTitle.innerHTML = config.heroTitle.replace('KKT HOMES', '<span class="primary-red-text">KKT HOMES</span>');
        }
    }

    // Update Hero Subtitle
    if (config.heroSubtitle) {
        const heroSubtitle = document.getElementById('dynamic-hero-subtitle');
        if (heroSubtitle) heroSubtitle.innerText = config.heroSubtitle;
    }

    // Update Hero Button
    if (config.heroBtnText) {
        const heroBtn = document.getElementById('dynamic-hero-btn');
        if (heroBtn) heroBtn.innerText = config.heroBtnText;
    }

    // Update Overview Content
    if (config.overviewText) {
        const overviewText = document.getElementById('dynamic-overview-text');
        if (overviewText) overviewText.innerHTML = config.overviewText;
    }

    // Update Overview Image
    if (config.overviewImage) {
        const overviewImg = document.getElementById('dynamic-overview-img');
        if (overviewImg) overviewImg.src = config.overviewImage;
    }

    // Update About Page Hero
    if (config.aboutPageHeroImage) {
        const aboutHeroImg = document.getElementById('dynamic-about-hero-img');
        if (aboutHeroImg) aboutHeroImg.src = config.aboutPageHeroImage;
    }

    // Update About Page Content
    if (config.aboutPageContentImage) {
        const aboutContentImg = document.getElementById('dynamic-about-content-img');
        if (aboutContentImg) aboutContentImg.src = config.aboutPageContentImage;
    }

    if (config.aboutPageTitle) {
        const aboutTitle = document.getElementById('dynamic-about-title');
        if (aboutTitle) aboutTitle.innerText = config.aboutPageTitle;
    }

    if (config.aboutPageText) {
        const aboutText = document.getElementById('dynamic-about-text');
        if (aboutText) aboutText.innerText = config.aboutPageText;
    }

    // Update Stats Bar
    if (config.stats) {
        config.stats.forEach((stat, i) => {
            const numEl = document.getElementById(`stat-number-${i + 1}`);
            const labEl = document.getElementById(`stat-label-${i + 1}`);
            if (numEl) numEl.innerText = stat.val;
            if (labEl) labEl.innerText = stat.lab;
        });
    }

    // Update Services
    const hServicesContainer = document.getElementById('dynamic-services-container');
    if (hServicesContainer && config.services) {
        hServicesContainer.innerHTML = '';
        config.services.forEach((service, i) => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-image-container">
                    <img src="${service.img || 'hero-bg.jpg'}" alt="${service.title}" id="service-img-${i + 1}" class="service-img">
                </div>
                <h3 id="service-title-${i + 1}">${service.title}</h3>
                <p id="service-desc-${i + 1}">${service.desc}</p>
            `;
            hServicesContainer.appendChild(card);
        });
    }

    // Update Services Page Specific Content
    if (config.servicesPage) {
        const sp = config.servicesPage;

        // Hero
        const sHeroImg = document.getElementById('dynamic-services-hero-img');
        const sHeroTitle = document.getElementById('dynamic-services-hero-title');
        const sHeroSubtitle = document.getElementById('dynamic-services-hero-subtitle');

        if (sHeroImg && sp.heroImg) sHeroImg.src = sp.heroImg;
        if (sHeroTitle && sp.heroTitle) {
            sHeroTitle.innerHTML = sp.heroTitle.replace('SERVICES', '<span class="primary-red-text">SERVICES</span>');
        }
        if (sHeroSubtitle && sp.heroSubtitle) sHeroSubtitle.innerText = sp.heroSubtitle;

        // Header
        const sHeaderTitle = document.getElementById('dynamic-services-header-title');
        if (sHeaderTitle && sp.headerTitle) sHeaderTitle.innerText = sp.headerTitle;

        // Additional Services
        const extraContainer = document.getElementById('dynamic-extra-services-container');
        if (extraContainer && sp.extraServices) {
            extraContainer.innerHTML = '';
            sp.extraServices.forEach((extra, i) => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.style.padding = '30px';

                let mediaHtml = '';
                if (extra.img) {
                    mediaHtml = `
                        <div class="service-image-container" style="margin-bottom: 1.5rem;">
                            <img src="${extra.img}" alt="${extra.title}" class="service-img" style="border-radius: 8px;">
                        </div>`;
                } else {
                    mediaHtml = `
                        <i id="extra-service-icon-${i + 1}" class="${extra.icon || 'fas fa-star'}"
                            style="font-size: 2rem; color: var(--primary-red); margin-bottom: 1rem;"></i>`;
                }

                card.innerHTML = `
                    ${mediaHtml}
                    <h3 id="extra-service-title-${i + 1}">${extra.title}</h3>
                    <p id="extra-service-desc-${i + 1}">${extra.desc}</p>
                `;
                extraContainer.appendChild(card);
            });
        }
    }

    // Update Featured Projects
    if (config.projects && config.projects.length > 0) {
        projectsData = config.projects; // Use all projects, fallback if img is missing
        if (projectsData.length > 0) {
            initProjectSlider();
        }
    } else {
        // Default Projects if none configured
        projectsData = [
            { img: 'hero-bg.jpg', title: 'Modern Villa', loc: 'Colombo' },
            { img: 'hero-bg.jpg', title: 'Luxury Appaitment', loc: 'Kandy' },
            { img: 'hero-bg.jpg', title: 'Beach House', loc: 'Galle' }
        ];
        initProjectSlider();
    }

    // Update Designs Page Grid
    if (config.designs && config.designs.length > 0) {
        renderDesigns(config.designs);
    } else {
        // Default Designs if none configured
        const defaultDesigns = [
            { img: 'hero-bg.jpg', title: 'Modern Villa', loc: 'Colombo' },
            { img: 'hero-bg.jpg', title: 'Luxury Apartment', loc: 'Kandy' },
            { img: 'hero-bg.jpg', title: 'Beach House', loc: 'Galle' }
        ];
        renderDesigns(defaultDesigns);
    }
}


function initProjectSlider() {
    const container = document.getElementById('dynamic-projects-container');
    const dotsContainer = document.getElementById('project-dots');
    const prevBtn = document.getElementById('proj-prev');
    const nextBtn = document.getElementById('proj-next');

    if (!container || !dotsContainer) return;

    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    projectsData.forEach((proj, index) => {
        // Create Card
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${proj.img}" alt="${proj.title}">
            <div class="project-info">
                <h3>${proj.title}</h3>
                <p><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${proj.loc}</p>
            </div>
        `;
        container.appendChild(card);

        // Create Dot
        const dot = document.createElement('div');
        dot.className = `project-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => {
            currentProjIndex = index;
            updateProjectSlider();
        };
        dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.onclick = () => {
        currentProjIndex = (currentProjIndex - 1 + projectsData.length) % projectsData.length;
        updateProjectSlider();
    };

    if (nextBtn) nextBtn.onclick = () => {
        currentProjIndex = (currentProjIndex + 1) % projectsData.length;
        updateProjectSlider();
    };

    updateProjectSlider();
}

function updateProjectSlider() {
    const cards = document.querySelectorAll('.project-card');
    const dots = document.querySelectorAll('.project-dot');
    const len = projectsData.length;

    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        card.className = 'project-card'; // Reset classes

        let position = index - currentProjIndex;

        // Handle wrapping for positions
        if (position < -1 && currentProjIndex === len - 1) position = 1;
        if (position > 1 && currentProjIndex === 0) position = -1;
        if (position < -1) position = -2; // Hidden left
        if (position > 1) position = 2;   // Hidden right

        if (position === 0) {
            card.classList.add('center', 'active-slide');
        } else if (position === -1 || (currentProjIndex === 0 && index === len - 1)) {
            card.classList.add('left', 'active-slide');
        } else if (position === 1 || (currentProjIndex === len - 1 && index === 0)) {
            card.classList.add('right', 'active-slide');
        } else if (position <= -2) {
            card.classList.add('hidden-left');
        } else {
            card.classList.add('hidden-right');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentProjIndex);
    });
}

function renderDesigns(designs) {
    const container = document.getElementById('dynamic-designs-container');
    if (!container) return;

    container.innerHTML = '';

    designs.forEach(design => {
        const item = document.createElement('div');
        item.className = 'design-item';
        item.innerHTML = `
            <img src="${design.img || 'hero-bg.jpg'}" alt="${design.title}">
            <div class="design-overlay">
                <h3>${design.title}</h3>
                <p><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${design.loc}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

function startSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidesDisplay();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlidesDisplay();
    startSlideshow(); // Reset timer
}

function updateSlidesDisplay() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}
