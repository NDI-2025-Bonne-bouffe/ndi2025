import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './css/ecology.css';
import ecologyData from './data/ecology.json';
import { initNavigation } from './components/Navigation.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Navigation
    initNavigation();

    // Structure principale
    const container = document.createElement('div');
    container.className = 'ecology-container';
    
    // Hero Section
    const hero = document.createElement('div');
    hero.className = 'hero-section';
    hero.innerHTML = `
        <h1 class="hero-title">Écologie Numérique</h1>
        <p class="hero-subtitle">Comment rendre nos établissements scolaires plus durables grâce au numérique responsable.</p>
    `;
    container.appendChild(hero);

    // Timeline Container
    const timeline = document.createElement('div');
    timeline.className = 'eco-timeline';
    
    ecologyData.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'eco-card-wrapper';
        
        const actionsHtml = item.actions.map(action => `
            <div class="action-item">
                <span class="action-title">${action.title}</span>
                <p class="action-text">${action.text}</p>
            </div>
        `).join('');

        wrapper.innerHTML = `
            <div class="eco-card" style="border-color: ${item.color}40">
                <div class="card-header">
                    <span class="card-icon">${item.icon}</span>
                    <h2 class="card-title" style="color: ${item.color}">${item.title}</h2>
                </div>
                <p class="card-desc">${item.description}</p>
                <div class="actions-list">
                    ${actionsHtml}
                </div>
            </div>
        `;
        timeline.appendChild(wrapper);
    });

    container.appendChild(timeline);
    app.appendChild(container);

    // Animations GSAP
    
    // Hero Animation
    gsap.from(".hero-title", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
    });

    // Timeline Cards Animation
    const cards = document.querySelectorAll('.eco-card-wrapper');
    
    cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? 100 : -100; // Alterner gauche/droite
        
        gsap.from(card.querySelector('.eco-card'), {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse"
            },
            x: direction,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
});
