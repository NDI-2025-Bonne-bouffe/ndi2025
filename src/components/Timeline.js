import { TimelineEvent } from './TimelineEvent.js';
import { TimelineBranch } from './TimelineBranch.js';

/**
 * Timeline Component
 * Composant principal qui charge les données et structure la timeline
 */
export class Timeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.events = [];
    this.branches = {};
    this.timelineBranch = null;
    this.eventElements = [];
  }

  /**
   * Charge les données depuis le fichier JSON
   */
  async loadData() {
    try {
      const response = await fetch('/src/data/timeline-events.json');
      const data = await response.json();
      this.events = data.events;
      this.branches = data.branches;
      
      // Trier les événements par date
      this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  }

  /**
   * Crée l'en-tête de la timeline
   */
  createHeader() {
    return `
      <div class="timeline-header">
        <h1>Histoire de l'Open Source</h1>
        <p>Une timeline interactive inspirée de GitLab</p>
      </div>
    `;
  }

  /**
   * Crée le conteneur principal de la timeline
   */
  createTimelineStructure() {
    return `
      <div class="timeline">
        <div class="timeline-events" id="timeline-events"></div>
      </div>
    `;
  }

  /**
   * Rend tous les événements
   */
  renderEvents() {
    const eventsContainer = this.container.querySelector('#timeline-events');
    if (!eventsContainer) return;

    eventsContainer.innerHTML = '';
    this.eventElements = [];

    this.events.forEach((event, index) => {
      const branchInfo = this.branches[event.branch];
      const timelineEvent = new TimelineEvent(event, branchInfo);
      const eventElement = timelineEvent.createElement();
      
      eventsContainer.appendChild(eventElement);
      this.eventElements.push({
        element: eventElement,
        event: event,
        index: index
      });
    });
  }

  /**
   * Initialise les branches SVG
   */
  initBranches() {
    const timelineElement = this.container.querySelector('.timeline');
    if (!timelineElement) return;

    this.timelineBranch = new TimelineBranch(timelineElement);
    this.timelineBranch.init(timelineElement);
    
    // Mettre à jour les dimensions après le rendu
    setTimeout(() => {
      this.updateBranchDimensions();
    }, 100);
  }

  /**
   * Met à jour les dimensions des branches
   */
  updateBranchDimensions() {
    const timelineElement = this.container.querySelector('.timeline');
    if (!timelineElement || !this.timelineBranch) return;

    const rect = timelineElement.getBoundingClientRect();
    this.timelineBranch.updateDimensions(rect.width, rect.height);
    this.timelineBranch.drawBranches(
      this.events,
      this.branches,
      rect.height,
      rect.width,
      this.eventElements
    );
  }

  /**
   * Initialise la timeline
   */
  async init() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    try {
      // Charger les données
      await this.loadData();

      // Créer la structure HTML
      this.container.innerHTML = `
        ${this.createHeader()}
        ${this.createTimelineStructure()}
      `;

      // Rendre les événements
      this.renderEvents();

      // Initialiser les branches après un court délai pour que le DOM soit complètement rendu
      this.initBranches();
      
      // Redessiner les branches après que tout soit positionné
      setTimeout(() => {
        this.updateBranchDimensions();
      }, 200);

      // Mettre à jour les dimensions au redimensionnement
      window.addEventListener('resize', () => {
        this.updateBranchDimensions();
      });

      return this;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la timeline:', error);
      this.container.innerHTML = `
        <div class="timeline-loading">
          <p>Erreur lors du chargement de la timeline</p>
        </div>
      `;
    }
  }

  /**
   * Retourne les éléments d'événements pour les animations
   */
  getEventElements() {
    return this.eventElements;
  }

  /**
   * Retourne les branches SVG pour les animations
   */
  getBranchPaths() {
    if (!this.timelineBranch || !this.timelineBranch.svg) {
      return [];
    }
    return Array.from(this.timelineBranch.svg.querySelectorAll('.timeline-branch-line'));
  }
}
