// ========================================
// 🛠️ Utils - Вспомогательные функции
// ========================================

// Форматирование даты
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('ru-RU', options);
}

// Короткий формат даты
function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

// Относительное время (назад)
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'только что';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин. назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч. назад`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} дн. назад`;
  return formatDateShort(dateString);
}

// Сокращение текста
function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Получить emoji категории
function getCategoryEmoji(category) {
  const emojis = {
    education: '📚',
    entertainment: '🎭',
    sports: '⚽',
    technology: '💻',
    business: '💼',
    arts: '🎨',
    social: '🤝',
    other: '📌'
  };
  return emojis[category] || '📌';
}

// Получить название категории на русском
function getCategoryName(category) {
  const names = {
    education: 'Образование',
    entertainment: 'Развлечения',
    sports: 'Спорт',
    technology: 'Технологии',
    business: 'Бизнес',
    arts: 'Искусство',
    social: 'Социальное',
    other: 'Другое'
  };
  return names[category] || 'Другое';
}

// Показать уведомление
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; margin-left: auto;">✕</button>
  `;
  alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease;';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// Показать лоадер
function showLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
}

// Показать пустое состояние
function showEmptyState(container, title, message, actionBtn = null) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-text">${message}</p>
      ${actionBtn ? actionBtn : ''}
    </div>
  `;
}

// Показать ошибку
function showError(container, message) {
  container.innerHTML = `
    <div class="alert alert-error">
      <span>${message}</span>
    </div>
  `;
}

// Валидация email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Создать звёзды рейтинга
function createStars(rating, maxRating = 5) {
  let stars = '';
  for (let i = 1; i <= maxRating; i++) {
    stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
  }
  return `<div class="rating">${stars}</div>`;
}

// Создать интерактивные звёзды для оценки
function createInteractiveStars(currentRating, onRate) {
  const ratingDiv = document.createElement('div');
  ratingDiv.className = 'rating';
  
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = `star ${i <= currentRating ? 'filled' : ''}`;
    star.textContent = '★';
    star.style.cursor = 'pointer';
    
    star.addEventListener('click', () => onRate(i));
    star.addEventListener('mouseenter', () => {
      ratingDiv.querySelectorAll('.star').forEach((s, idx) => {
        s.classList.toggle('filled', idx < i);
      });
    });
    
    ratingDiv.appendChild(star);
  }
  
  ratingDiv.addEventListener('mouseleave', () => {
    ratingDiv.querySelectorAll('.star').forEach((s, idx) => {
      s.classList.toggle('filled', idx < currentRating);
    });
  });
  
  return ratingDiv;
}

// Получить параметр из URL
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Мобильное меню
function initMobileMenu() {
  const toggle = document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
  
  // Закрытие при клике вне меню
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

// Модальное окно
class Modal {
  constructor(title) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    
    this.overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close">✕</button>
        </div>
        <div class="modal-body"></div>
      </div>
    `;
    
    this.overlay.querySelector('.modal-close').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    document.body.appendChild(this.overlay);
  }
  
  setContent(content) {
    this.overlay.querySelector('.modal-body').innerHTML = content;
  }
  
  open() {
    setTimeout(() => this.overlay.classList.add('active'), 10);
  }
  
  close() {
    this.overlay.classList.remove('active');
    setTimeout(() => this.overlay.remove(), 300);
  }
}

// Debounce для поиска
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  
  // Добавляем CSS для анимаций
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});
