// ========================================
// 🔐 Auth Module - Управление аутентификацией
// ========================================

// Проверка авторизации
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Получить данные пользователя
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Проверка роли admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

// Сохранить данные после входа
function saveAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Очистить данные при выходе
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Выход
function logout() {
  clearAuthData();
  window.location.href = '/frontend/pages/login.html';
}

// Защита страницы (перенаправление если не авторизован)
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/frontend/pages/login.html';
    return false;
  }
  return true;
}

// Защита админ-страницы
function requireAdmin() {
  if (!isAuthenticated() || !isAdmin()) {
    window.location.href = '/frontend/index.html';
    return false;
  }
  return true;
}

// Обновить UI навигации
function updateNavigation() {
  const navMenu = document.querySelector('.navbar-menu');
  if (!navMenu) return;

  const user = getCurrentUser();
  
  // Удаляем старые кнопки авторизации
  const oldAuthBtns = navMenu.querySelectorAll('.auth-nav-item');
  oldAuthBtns.forEach(btn => btn.remove());

  if (isAuthenticated()) {
    // Пользователь авторизован
    navMenu.innerHTML += `
      ${isAdmin() ? `
        <li class="auth-nav-item">
          <a href="/frontend/pages/admin/create-event.html" class="navbar-link">➕ Создать</a>
        </li>
      ` : ''}
      <li class="auth-nav-item">
        <a href="/frontend/pages/profile.html" class="navbar-link">👤 ${user ? user.username : 'Профиль'}</a>
      </li>
      <li class="auth-nav-item">
        <button onclick="logout()" class="btn btn-sm btn-outline">Выход</button>
      </li>
    `;
  } else {
    // Пользователь не авторизован
    navMenu.innerHTML += `
      <li class="auth-nav-item">
        <a href="/frontend/pages/login.html" class="navbar-link">Вход</a>
      </li>
      <li class="auth-nav-item">
        <a href="/frontend/pages/register.html" class="btn btn-sm btn-primary">Регистрация</a>
      </li>
    `;
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateNavigation();
});
