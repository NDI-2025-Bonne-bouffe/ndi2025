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
    this.boundHandler = null;
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
    this.boundHandler = this.handleKeyPress.bind(this);
    document.addEventListener('keydown', this.boundHandler, true);
    console.log('✅ Konami code initialisé. Séquence: ↑ ↑ ← → ← → B A');
    console.log('Test: Appuyez sur n\'importe quelle touche pour vérifier que l\'écouteur fonctionne');
  }

  /**
   * Gère les pressions de touches
   */
  handleKeyPress(event) {
    // Ignorer les touches si on est dans un input/textarea
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    // Debug: afficher chaque touche pressée
    console.log('🔑 Touche pressée:', event.code, '| Séquence actuelle:', this.sequence);

    // Ajouter la touche à la séquence
    this.sequence.push(event.code);

    // Garder seulement les N dernières touches (N = longueur de la séquence cible)
    if (this.sequence.length > this.targetSequence.length) {
      this.sequence.shift();
    }

    // Vérifier si la séquence correspond
    if (this.sequence.length === this.targetSequence.length) {
      const matches = this.sequence.every((key, index) => 
        key === this.targetSequence[index]
      );

      console.log('🔍 Vérification séquence:', {
        actuelle: this.sequence,
        cible: this.targetSequence,
        correspond: matches
      });

      if (matches) {
        // Séquence complète détectée !
        console.log('🎉🎉🎉 Konami code détecté ! Redirection...');
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
    if (this.boundHandler) {
      document.removeEventListener('keydown', this.boundHandler, true);
    }
  }
}
