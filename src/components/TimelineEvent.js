/**
 * TimelineEvent Component
 * Affiche un événement de la timeline avec un style GitLab (commit/merge request)
 */
export class TimelineEvent {
  constructor(event, branchInfo) {
    this.event = event;
    this.branchInfo = branchInfo;
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Récupère les initiales de l'auteur
   */
  getAuthorInitials(author) {
    return author
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Génère le HTML de l'événement
   */
  render() {
    const { event, branchInfo } = this;
    const branchColor = branchInfo?.color || event.color || '#FC6D26';

    return `
      <div class="timeline-event-item" data-event-id="${event.id}">
        <div class="timeline-event-card" style="border-left: 3px solid ${branchColor}">
          <div class="event-header">
            <h3 class="event-title">${event.title}</h3>
            <span class="event-date">${this.formatDate(event.date)}</span>
          </div>
          
          <div class="event-author">
            <div class="event-author-icon" style="background-color: ${branchColor}">
              ${this.getAuthorInitials(event.author)}
            </div>
            <span>${event.author}</span>
          </div>
          
          <p class="event-description">${event.description}</p>
          
          ${event.branch ? `
            <div class="event-branch" style="color: ${branchColor}">
              ${branchInfo?.name || event.branch}
            </div>
          ` : ''}
          
          ${event.tags && event.tags.length > 0 ? `
            <div class="event-tags">
              ${event.tags.map(tag => `
                <span class="event-tag">${tag}</span>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="event-type-indicator ${event.type}" style="background-color: ${branchColor}"></div>
      </div>
    `;
  }

  /**
   * Crée et retourne un élément DOM
   */
  createElement() {
    const container = document.createElement('div');
    container.innerHTML = this.render();
    return container.firstElementChild;
  }
}

