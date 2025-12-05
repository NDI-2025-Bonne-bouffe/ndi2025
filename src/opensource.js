import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './css/globals.css';
import './css/opensource.css';
import openSourceData from './data/opensource.json';
import { initNavigation } from './components/Navigation.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Navigation
    initNavigation();

    // Container
    const container = document.createElement('div');
    container.className = 'opensource-container';

    // Hero
    const hero = document.createElement('div');
    hero.className = 'os-hero';
    hero.innerHTML = `
        <h1 class="os-title">${openSourceData.hero.title}</h1>
        <p class="os-subtitle">${openSourceData.hero.subtitle}</p>
    `;
    container.appendChild(hero);

    // Sections
    openSourceData.sections.forEach(section => {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'os-section';
        sectionEl.innerHTML = `
            <div class="os-icon">${section.icon}</div>
            <div class="os-content">
                <h2>${section.title}</h2>
                <p>${section.content}</p>
            </div>
        `;
        container.appendChild(sectionEl);
    });

    app.appendChild(container);

    // Animations
    gsap.from(".os-title", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".os-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.utils.toArray('.os-section').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out"
        });
    });
});
