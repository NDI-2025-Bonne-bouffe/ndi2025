/**
 * Konami Code Handler
 * Détecte la séquence: ↑ ↑ ← → ← → B A
 */
export class KonamiCode {
  constructor() {
    this.sequence = [];
    this.targetSequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA'
    ];
    this.onComplete = null;
  }

  /**
   * Initialise le détecteur de Konami code
   */
  init(onComplete) {
    this.onComplete = onComplete;
    
    // S'assurer que le DOM est chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.attachListener();
      });
    } else {
      this.attachListener();
    }
  }

  /**
   * Attache l'écouteur d'événements
   */
  attachListener() {
    // Utiliser capture pour intercepter les événements même si d'autres handlers existent
    document.addEventListener('keydown', this.handleKeyPress.bind(this), true);
    console.log('Konami code initialisé. Séquence: ↑ ↑ ← → ← → B A');
  }

  /**
   * Gère les pressions de touches
   */
  handleKeyPress(event) {
    // Ignorer les touches si on est dans un input/textarea
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    // Empêcher le comportement par défaut pour les touches de navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      // Ne pas empêcher complètement, juste pour éviter le scroll
    }

    // Ajouter la touche à la séquence
    this.sequence.push(event.code);

    // Garder seulement les N dernières touches (N = longueur de la séquence cible)
    if (this.sequence.length > this.targetSequence.length) {
      this.sequence.shift();
    }

    // Debug: afficher la séquence actuelle (optionnel, à retirer en production)
    // console.log('Séquence actuelle:', this.sequence);

    // Vérifier si la séquence correspond
    if (this.sequence.length === this.targetSequence.length) {
      const matches = this.sequence.every((key, index) => 
        key === this.targetSequence[index]
      );

      if (matches) {
        // Séquence complète détectée !
        console.log('🎉 Konami code détecté ! Redirection...');
        event.preventDefault();
        event.stopPropagation();
        this.sequence = []; // Réinitialiser
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }
  }

  /**
   * Nettoie les écouteurs d'événements
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this), true);
  }
}

