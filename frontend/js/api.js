// ========================================
// 🔌 API Module - Работа с бэкендом
// ========================================

const API_BASE_URL = 'http://localhost:5000/api';

// Вспомогательная функция для HTTP запросов
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Что-то пошло не так');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========================================
// 🔐 AUTH API
// ========================================

const authAPI = {
  // Регистрация
  async register(username, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  // Вход
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Получить текущего пользователя
  async getMe() {
    return request('/auth/me');
  },
};

// ========================================
// 🎭 EVENTS API
// ========================================

const eventsAPI = {
  // Получить все события
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.date) params.append('date', filters.date);
    
    const query = params.toString() ? `?${params}` : '';
    return request(`/events${query}`);
  },

  // Получить одно событие
  async getById(id) {
    return request(`/events/${id}`);
  },

  // Создать событие (только admin)
  async create(eventData) {
    return request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Обновить событие (только admin)
  async update(id, eventData) {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Удалить событие (только admin)
  async delete(id) {
    return request(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Лайк/анлайк события
  async toggleLike(id) {
    return request(`/events/${id}/like`, {
      method: 'POST',
    });
  },

  // Добавить комментарий
  async addComment(id, content) {
    return request(`/events/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Удалить комментарий
  async deleteComment(eventId, commentId) {
    return request(`/events/${eventId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Лайк комментария
  async toggleCommentLike(eventId, commentId) {
    return request(`/events/${eventId}/comments/${commentId}/like`, {
      method: 'POST',
    });
  },

  // Оценить событие
  async rate(id, rating) {
    return request(`/events/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },
};

// ========================================
// 📢 ANNOUNCEMENTS API
// ========================================

const announcementsAPI = {
  // Получить все объявления
  async getAll() {
    return request('/announcements');
  },

  // Получить одно объявление
  async getById(id) {
    return request(`/announcements/${id}`);
  },

  // Создать объявление (только admin)
  async create(announcementData) {
    return request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  // Обновить объявление (только admin)
  async update(id, announcementData) {
    return request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  },

  // Удалить объявление (только admin)
  async delete(id) {
    return request(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // Лайк/анлайк объявления
  async toggleLike(id) {
    return request(`/announcements/${id}/like`, {
      method: 'POST',
    });
  },
};

// ========================================
// 👤 USER API
// ========================================

const userAPI = {
  // Получить профиль
  async getProfile() {
    return request('/users/profile');
  },

  // Обновить профиль
  async updateProfile(username, email) {
    return request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ username, email }),
    });
  },

  // Добавить/удалить из избранного
  async toggleFavorite(eventId) {
    return request(`/users/favorites/${eventId}`, {
      method: 'POST',
    });
  },

  // Получить избранные события
  async getFavorites() {
    return request('/users/favorites');
  },
};
