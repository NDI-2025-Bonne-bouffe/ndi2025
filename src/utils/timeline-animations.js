import { gsap } from 'gsap';

// ScrollTrigger sera chargé depuis main.js si disponible
let ScrollTrigger = null;

/**
 * Initialise ScrollTrigger si disponible
 */
export function initScrollTrigger() {
  try {
    // Essayer d'importer ScrollTrigger
    import('gsap/ScrollTrigger').then(module => {
      ScrollTrigger = module.ScrollTrigger;
      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }
    }).catch(() => {
      // ScrollTrigger non disponible, on continue sans
      console.warn('ScrollTrigger non disponible, animations simplifiées');
    });
  } catch (error) {
    // ScrollTrigger non disponible, on continue sans
    console.warn('ScrollTrigger non disponible, animations simplifiées');
  }
}

/**
 * Timeline Animations
 * Gère toutes les animations GSAP pour la timeline
 */
export class TimelineAnimations {
  constructor(timeline) {
    this.timeline = timeline;
    this.animations = [];
  }

  /**
   * Anime l'apparition d'un événement au scroll
   */
  animateEvent(eventElement, index) {
    const card = eventElement.querySelector('.timeline-event-card');
    const indicator = eventElement.querySelector('.event-type-indicator');

    if (!card || !indicator) return;

    // Configuration de l'animation avec ou sans ScrollTrigger
    const animationConfig = {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    };

    // Ajouter ScrollTrigger si disponible
    if (ScrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: eventElement,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      };
    } else {
      // Fallback: animation simple avec délai
      animationConfig.delay = index * 0.1;
    }

    // Animation de la carte
    const cardAnimation = gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      animationConfig
    );

    // Animation de l'indicateur
    const indicatorConfig = {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: 0.2
    };

    if (!ScrollTrigger) {
      indicatorConfig.delay = (index * 0.1) + 0.2;
    } else {
      indicatorConfig.scrollTrigger = {
        trigger: eventElement,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      };
    }

    const indicatorAnimation = gsap.fromTo(
      indicator,
      {
        scale: 0,
        opacity: 0
      },
      indicatorConfig
    );

    // Animation des tags
    const tags = eventElement.querySelectorAll('.event-tag');
    if (tags.length > 0) {
      const tagsConfig = {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power2.out'
      };

      if (ScrollTrigger) {
        tagsConfig.scrollTrigger = {
          trigger: eventElement,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        };
      } else {
        tagsConfig.delay = (index * 0.1) + 0.4;
      }

      gsap.fromTo(
        tags,
        {
          opacity: 0,
          x: -20
        },
        tagsConfig
      );
    }

    this.animations.push(cardAnimation, indicatorAnimation);
  }

  /**
   * Anime le dessin d'une branche SVG
   */
  animateBranch(branchPath, delay = 0) {
    if (!branchPath) return;
    
    const pathLength = branchPath.getTotalLength();
    
    // Réinitialiser le path
    branchPath.style.strokeDasharray = pathLength;
    branchPath.style.strokeDashoffset = pathLength;

    const animationConfig = {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: delay
    };

    if (ScrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: branchPath,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      };
    }

    const animation = gsap.to(branchPath, animationConfig);

    this.animations.push(animation);
    return animation;
  }

  /**
   * Anime toutes les branches
   */
  animateAllBranches(branchPaths) {
    branchPaths.forEach((path, index) => {
      this.animateBranch(path, index * 0.1);
    });
  }

  /**
   * Anime la ligne principale de la timeline
   */
  animateMainLine() {
    // Animation de la ligne principale au chargement
    const animationConfig = {
      '--timeline-progress': '100%',
      duration: 2,
      ease: 'power2.inOut'
    };

    if (ScrollTrigger) {
      animationConfig.scrollTrigger = {
        trigger: '.timeline',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      };
    }

    gsap.fromTo(
      '.timeline',
      {
        '--timeline-progress': '0%'
      },
      animationConfig
    );
  }

  /**
   * Anime l'apparition de tous les événements
   */
  animateAllEvents(eventElements) {
    eventElements.forEach((item, index) => {
      // Délai progressif pour créer un effet de cascade
      setTimeout(() => {
        this.animateEvent(item.element, index);
      }, index * 50);
    });
  }

  /**
   * Animation d'entrée pour le header
   */
  animateHeader() {
    const header = document.querySelector('.timeline-header');
    if (!header) return;

    gsap.fromTo(
      header,
      {
        opacity: 0,
        y: -30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }
    );
  }

  /**
   * Initialise toutes les animations
   */
  init() {
    // Animer le header
    this.animateHeader();

    // Attendre que la timeline soit rendue
    setTimeout(() => {
      const eventElements = this.timeline.getEventElements();
      const branchPaths = this.timeline.getBranchPaths();

      // Animer les événements
      if (eventElements.length > 0) {
        this.animateAllEvents(eventElements);
      }

      // Animer les branches
      if (branchPaths.length > 0) {
        this.animateAllBranches(branchPaths);
      }

      // Animer la ligne principale
      this.animateMainLine();
    }, 300);
  }

  /**
   * Nettoie toutes les animations
   */
  cleanup() {
    this.animations.forEach(animation => {
      if (animation && animation.kill) {
        animation.kill();
      }
    });
    if (ScrollTrigger && ScrollTrigger.getAll) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    this.animations = [];
  }

  /**
   * Rafraîchit les animations (utile après redimensionnement)
   */
  refresh() {
    if (ScrollTrigger && ScrollTrigger.refresh) {
      ScrollTrigger.refresh();
    }
  }
}

