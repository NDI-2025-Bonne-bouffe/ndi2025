# Stack Technique

Ce projet utilise une stack moderne et légère, sans framework JavaScript.

## Core
- **Langage** : JavaScript (ES6+ Modules)
- **Build Tool** : [Vite](https://vitejs.dev/) - Pour un environnement de développement rapide et un build optimisé.
- **Gestionnaire de paquets** : npm

## Frontend
- **Structure** : Vanilla JS avec une architecture orientée composants (Classes ES6).
- **HTML** : HTML5 sémantique.
- **CSS** : CSS3 natif avec utilisation intensive des Customs Properties (Variables CSS) pour le theming.
  - Thème inspiré de GitLab (`gitlab-theme.css`).
- **Animations** : [GSAP](https://gsap.com/) (GreenSock Animation Platform) pour les animations complexes de la timeline et ScrollTrigger.

## Architecture des dossiers
- `src/components/` : Composants logiques de l'interface (Timeline, Navigation, etc.).
- `src/css/` : Styles globaux et spécifiques aux composants.
