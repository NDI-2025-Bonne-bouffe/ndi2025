import '../css/navigation.css';

export function initNavigation() {
  const app = document.getElementById('app');
  
  // Header
  const header = document.createElement('header');
  header.className = 'main-header';
  header.innerHTML = `
    <a href="/opensource.html" class="logo">NDI 2025</a>
    <nav>
      <ul class="nav-links">
        <li><a href="/index.html">Timeline</a></li>
        <li><a href="/alternatives.html">Alternatives</a></li>
        <li><a href="/ecology.html">Écologie</a></li>
      </ul>
    </nav>
  `;
  
  // Footer
  const footer = document.createElement('footer');
  footer.className = 'main-footer';
  footer.innerHTML = `
    <p>&copy; 2025 Nuit de l'Info - Équipe Bonne Bouffe</p>
  `;

  // Insert Header at the beginning
  app.insertBefore(header, app.firstChild);
  
  // Insert Footer at the end
  app.appendChild(footer);

  // Highlight active link
  const currentPath = window.location.pathname;
  const links = header.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
      link.classList.add('active');
    }
  });

  return { header, footer };
}
