import { API_URL } from './config.js';
import { showToast } from './notifications.js';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
    });

    // Solo recargar si falla una ruta que NO sea de login
    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.clear();
      location.reload();
      return null;
    }

    if (!res.ok) {
      // Intentamos sacar el mensaje de error del backend
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.message || 'Error en la operación';
      showToast(msg, 'error');
      return res; // Devolvemos la respuesta para que app.js pueda ver que falló
    }

    return res;
  } catch (error) {
    showToast('Error de conexión', 'error');
    return null;
  }
}
export const authService = {
  async auth(type, email, password) {
    return apiFetch(`/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username: email.split('@')[0] }),
    });
  },
  async getMe() {
    const res = await apiFetch('/users/me');
    return res ? res.json() : null;
  },
};

export const postService = {
  async getPosts(page, limit) {
    const res = await apiFetch(`/posts?page=${page}&limit=${limit}`);
    return res ? res.json() : null;
  },
  async createPost(content) {
    return apiFetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  },
  async toggleLike(postId) {
    return apiFetch(`/posts/${postId}/like`, { method: 'POST' });
  },
  async addComment(postId, content) {
    return apiFetch(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  },
};
