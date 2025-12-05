import { gsap } from "gsap";
import './css/alternatives.css';
import alternativesData from './data/alternatives.json';
import { initNavigation } from './components/Navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Initialiser la navigation (Header & Footer)
    const { header, footer } = initNavigation();

    // Création du conteneur des noeuds
    const nodesContainer = document.createElement('div');
    nodesContainer.className = 'nodes-container';
    app.appendChild(nodesContainer);

    // Bouton retour à la timeline (supprimé car maintenant dans le header)
    // const homeButton = document.createElement('a');
    // ...
    // app.appendChild(homeButton);

    // Création de l'overlay de détails
    const detailsOverlay = document.createElement('div');
    detailsOverlay.className = 'details-overlay';
    detailsOverlay.innerHTML = `
        <div class="details-header">
            <button class="back-button">← Retour aux noeuds</button>
        </div>
        <div class="details-content">
            <h2 class="category-title"></h2>
            <div class="alternatives-grid"></div>
        </div>
    `;
    app.appendChild(detailsOverlay);

    const backButton = detailsOverlay.querySelector('.back-button');
    const categoryTitle = detailsOverlay.querySelector('.category-title');
    const alternativesGrid = detailsOverlay.querySelector('.alternatives-grid');

    // Création des noeuds
    const nodes = [];
    
    // Positionnement initial dispersé
    const positions = [
        { x: -200, y: -100 },
        { x: 200, y: -100 },
        { x: 0, y: 150 }
    ];

    alternativesData.forEach((category, index) => {
        const node = document.createElement('div');
        node.className = 'node';
        node.textContent = category.label;
        node.style.backgroundColor = category.color;
        
        // Positionnement initial
        gsap.set(node, { 
            x: positions[index % positions.length].x, 
            y: positions[index % positions.length].y 
        });

        node.addEventListener('click', () => showDetails(category));
        
        nodesContainer.appendChild(node);
        nodes.push(node);
    });

    // Animation de flottement aléatoire pour chaque noeud
    nodes.forEach(node => {
        gsap.to(node, {
            y: "+=20",
            x: "+=10",
            rotation: "random(-5, 5)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    // Effet de parallaxe à la souris
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

        nodes.forEach((node, index) => {
            const depth = 1 + index * 0.5; // Profondeur différente pour chaque noeud
            gsap.to(node, {
                x: positions[index].x + mouseX * 50 * depth,
                y: positions[index].y + mouseY * 50 * depth,
                duration: 1,
                ease: "power2.out",
                overwrite: "auto" // Important pour ne pas casser l'animation de flottement si possible, mais ici on écrase la position de base.
                // Pour combiner flottement et souris, il faudrait un wrapper ou modifier x/y différemment.
                // Simplification: on applique le mouvement souris sur la position de base.
            });
        });
    });
    
    // Pour combiner flottement et souris correctement, on utilise des modificateurs ou on anime un conteneur parent, 
    // ou on utilise xPercent/yPercent pour le flottement et x/y pour la souris.
    // Refaisons l'animation pour être plus propre.
    
    // Reset des animations précédentes pour faire propre
    gsap.killTweensOf(nodes);
    
    nodes.forEach((node, index) => {
        // Position de base
        const baseX = positions[index].x;
        const baseY = positions[index].y;
        
        gsap.set(node, { x: baseX, y: baseY });

        // Animation de flottement (utilise xPercent/yPercent pour être indépendant de x/y)
        gsap.to(node, {
            yPercent: "random(-10, 10)",
            xPercent: "random(-5, 5)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5);
        const mouseY = (e.clientY / window.innerHeight - 0.5);

        nodes.forEach((node, index) => {
            const factor = 50 + (index * 30); // Facteur de mouvement
            const baseX = positions[index].x;
            const baseY = positions[index].y;

            gsap.to(node, {
                x: baseX + mouseX * factor,
                y: baseY + mouseY * factor,
                duration: 1,
                ease: "power2.out"
            });
        });
    });


    // Fonction pour afficher les détails
    function showDetails(category) {
        detailsOverlay.style.pointerEvents = 'auto';
        detailsOverlay.style.visibility = 'visible'; // Force visibility
        // Remplir le contenu
        categoryTitle.textContent = `Alternatives à ${category.label}`;
        categoryTitle.style.color = category.color;
        
        alternativesGrid.innerHTML = '';
        category.alternatives.forEach(alt => {
            const card = document.createElement('div');
            card.className = 'alt-card';
            
            const prosHtml = alt.pros.map(p => `<li>${p}</li>`).join('');
            const consHtml = alt.cons.map(c => `<li>${c}</li>`).join('');

            card.innerHTML = `
                <div class="alt-header">
                    <span class="alt-name" style="color: ${category.color}">${alt.name}</span>
                    <span class="alt-difficulty difficulty-${alt.difficulty}">${alt.difficulty}</span>
                </div>
                <p class="alt-desc">${alt.description}</p>
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Positif</h4>
                        <ul>${prosHtml}</ul>
                    </div>
                    <div class="cons">
                        <h4>Négatif</h4>
                        <ul>${consHtml}</ul>
                    </div>
                </div>
            `;
            alternativesGrid.appendChild(card);
        });

        // Animation d'entrée
        const tl = gsap.timeline();
        
        // 1. Faire disparaître les noeuds, header et footer
        tl.to([...nodes, header, footer], {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.in(1.7)"
        });

        // 2. Afficher l'overlay
        tl.to(detailsOverlay, {
            autoAlpha: 1, // gère opacity + visibility
            duration: 0.5
        });

        // 3. Animer le contenu de l'overlay
        const detailsHeader = detailsOverlay.querySelector('.details-header');
        tl.from([detailsHeader, categoryTitle], {
            y: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1
        }, "-=0.3");

        tl.from(alternativesGrid.children, {
            y: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1
        }, "-=0.3");
    }

    // Fonction pour revenir en arrière
    backButton.addEventListener('click', () => {
        const tl = gsap.timeline();

        // 1. Cacher l'overlay
        tl.to(detailsOverlay, {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => {
                detailsOverlay.style.pointerEvents = 'none';
                detailsOverlay.style.visibility = 'hidden'; // Force hidden
            }
        });

        // 2. Réapparaître les noeuds, header et footer
        tl.to([...nodes, header, footer], {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
    });
});
