/**
 * TimelineBranch Component
 * Gère le rendu des branches SVG de la timeline
 */
export class TimelineBranch {
  constructor(container) {
    this.container = container;
    this.svg = null;
  }

  /**
   * Crée l'élément SVG pour les branches
   */
  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('timeline-branches');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    return svg;
  }

  /**
   * Calcule la position d'un événement sur la timeline
   */
  getEventPosition(eventIndex, totalEvents, containerHeight) {
    // Position verticale basée sur l'index de l'événement
    const spacing = containerHeight / (totalEvents + 1);
    return spacing * (eventIndex + 1);
  }

  /**
   * Dessine une ligne de branche entre deux points
   */
  drawBranchLine(svg, x1, y1, x2, y2, color, branchName, isStraight = false) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    let d;
    if (isStraight || Math.abs(x1 - x2) < 5) {
      // Ligne droite pour les connexions horizontales ou verticales
      d = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
      // Courbe Bézier pour les lignes diagonales
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const controlPoint1X = x1 + (midX - x1) * 0.5;
      const controlPoint1Y = y1 + (midY - y1) * 0.5;
      const controlPoint2X = x2 - (x2 - midX) * 0.5;
      const controlPoint2Y = y2 - (y2 - midY) * 0.5;
      
      d = `M ${x1} ${y1} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x2} ${y2}`;
    }
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', '0.3');
    path.classList.add('timeline-branch-line');
    path.setAttribute('data-branch', branchName);
    
    // Animation de dessin au scroll
    const pathLength = path.getTotalLength();
    path.setAttribute('stroke-dasharray', pathLength);
    path.setAttribute('stroke-dashoffset', pathLength);
    
    svg.appendChild(path);
    
    return path;
  }

  /**
   * Initialise le SVG dans le conteneur
   */
  init(container) {
    if (!this.svg) {
      this.svg = this.createSVG();
      container.appendChild(this.svg);
    }
    return this.svg;
  }

  /**
   * Met à jour les dimensions du SVG
   */
  updateDimensions(width, height) {
    if (this.svg) {
      this.svg.setAttribute('width', width);
      this.svg.setAttribute('height', height);
      this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  }

  /**
   * Dessine les branches pour tous les événements en utilisant les positions réelles des cards
   */
  drawBranches(events, branches, containerHeight, containerWidth, eventElements = []) {
    if (!this.svg || !eventElements || eventElements.length === 0) return;

    // Nettoyer les branches existantes
    this.svg.innerHTML = '';

    const timelineContainer = this.container;
    const timelineElement = timelineContainer.querySelector('.timeline');
    
    if (!timelineElement) return;

    // Dessiner les branches entre événements de la même branche
    const branchGroups = {};
    events.forEach((event, index) => {
      if (event.branch && !branchGroups[event.branch]) {
        branchGroups[event.branch] = [];
      }
      if (event.branch) {
        branchGroups[event.branch].push({ event, index });
      }
    });

    // Dessiner les lignes de branche en utilisant les positions réelles
    Object.keys(branchGroups).forEach(branchName => {
      const group = branchGroups[branchName];
      const branchInfo = branches[branchName];
      const color = branchInfo?.color || '#FC6D26';

      if (group.length > 1) {
        // Connecter les événements de la même branche
        for (let i = 0; i < group.length - 1; i++) {
          const current = group[i];
          const next = group[i + 1];
          
          // Trouver les éléments DOM correspondants
          const currentElement = eventElements.find(el => el.event.id === current.event.id);
          const nextElement = eventElements.find(el => el.event.id === next.event.id);
          
          if (!currentElement || !nextElement) continue;
          
          const currentCard = currentElement.element.querySelector('.timeline-event-card');
          const nextCard = nextElement.element.querySelector('.timeline-event-card');
          const currentIndicator = currentElement.element.querySelector('.event-type-indicator');
          const nextIndicator = nextElement.element.querySelector('.event-type-indicator');
          
          if (!currentCard || !nextCard || !currentIndicator || !nextIndicator) continue;
          
          // Obtenir les positions réelles par rapport au conteneur timeline
          const timelineRect = timelineElement.getBoundingClientRect();
          const svgRect = this.svg.getBoundingClientRect();
          const currentCardRect = currentCard.getBoundingClientRect();
          const nextCardRect = nextCard.getBoundingClientRect();
          const currentIndicatorRect = currentIndicator.getBoundingClientRect();
          const nextIndicatorRect = nextIndicator.getBoundingClientRect();
          
          // Calculer les positions relatives au SVG (qui est positionné absolument dans timeline)
          const currentY = currentIndicatorRect.top + currentIndicatorRect.height / 2 - timelineRect.top;
          const nextY = nextIndicatorRect.top + nextIndicatorRect.height / 2 - timelineRect.top;
          
          // Points de départ et d'arrivée sur les cards (relatifs au SVG)
          let x1, x2;
          
          // Pour les événements pairs (even = index % 2 === 0), la card est à gauche
          // Pour les événements impairs (odd = index % 2 === 1), la card est à droite
          if (current.index % 2 === 0) {
            // Événement à gauche (even) - partir du bord droit de la card
            x1 = currentCardRect.right - timelineRect.left;
          } else {
            // Événement à droite (odd) - partir du bord gauche de la card
            x1 = currentCardRect.left - timelineRect.left;
          }
          
          // Point central pour le premier événement
          const centerX1 = currentIndicatorRect.left + currentIndicatorRect.width / 2 - timelineRect.left;
          
          // Pour le deuxième événement
          if (next.index % 2 === 0) {
            // Événement à gauche (even) - arriver au bord droit de la card
            x2 = nextCardRect.right - timelineRect.left;
          } else {
            // Événement à droite (odd) - arriver au bord gauche de la card
            x2 = nextCardRect.left - timelineRect.left;
          }
          
          const centerX2 = nextIndicatorRect.left + nextIndicatorRect.width / 2 - timelineRect.left;
          
          // Dessiner la branche en trois parties : card -> centre -> centre -> card
          // Première partie : de la card au centre (ligne horizontale)
          this.drawBranchLine(this.svg, x1, currentY, centerX1, currentY, color, branchName, true);
          
          // Deuxième partie : du centre au centre (ligne verticale/diagonale)
          this.drawBranchLine(this.svg, centerX1, currentY, centerX2, nextY, color, branchName);
          
          // Troisième partie : du centre à la card (ligne horizontale)
          this.drawBranchLine(this.svg, centerX2, nextY, x2, nextY, color, branchName, true);
        }
      }
    });
  }

  /**
   * Anime le dessin d'une branche
   */
  animateBranch(path, duration = 1) {
    const pathLength = path.getTotalLength();
    path.setAttribute('stroke-dasharray', pathLength);
    path.setAttribute('stroke-dashoffset', pathLength);
    
    return {
      strokeDashoffset: 0,
      duration: duration,
      ease: 'power2.out'
    };
  }
}

