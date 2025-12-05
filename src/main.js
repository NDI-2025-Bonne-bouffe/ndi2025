import { Timeline } from './components/Timeline.js';
import { TimelineAnimations, initScrollTrigger } from './utils/timeline-animations.js';
import { initNavigation } from './components/Navigation.js';
import { KonamiCode } from './utils/konami-code.js';
import './css/globals.css';

// Initialiser ScrollTrigger si disponible
initScrollTrigger();

// Initialiser le Konami code
const konamiCode = new KonamiCode();
konamiCode.init(() => {
  console.log('🎉 Konami code activé ! Redirection vers terminal.html');
  // Essayer plusieurs chemins possibles
  const paths = [
    '/terminal.html',
    './terminal.html',
    window.location.origin + '/terminal.html'
  ];
  
  // Utiliser le premier chemin qui fonctionne
  window.location.href = paths[0];
});

// Initialiser la timeline
async function init() {
  const app = document.getElementById('app');
  
  // Initialiser la navigation
  initNavigation();
  
  // Créer le conteneur de la timeline
  const timelineContainer = document.createElement('div');
  timelineContainer.id = 'timeline-container';
  timelineContainer.className = 'timeline-container';
  app.appendChild(timelineContainer);

  // Créer et initialiser la timeline
  const timeline = new Timeline('timeline-container');
  await timeline.init();

  // Attendre un peu pour que ScrollTrigger soit chargé si disponible
  setTimeout(() => {
    // Initialiser les animations GSAP
    const animations = new TimelineAnimations(timeline);
    animations.init();
  }, 100);

  // Gérer le redimensionnement
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      timeline.updateBranchDimensions();
      animations.refresh();
    }, 250);
  });
}

// Démarrer l'application
init().catch(error => {
  console.error('Erreur lors de l\'initialisation:', error);
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="padding: 2rem; text-align: center; color: #e24329;">
      <h1>Erreur de chargement</h1>
      <p>Impossible de charger la timeline. Veuillez rafraîchir la page.</p>
    </div>
  `;
});
