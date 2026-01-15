import { API_URL } from './config.js';
import { showToast } from './notifications.js';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
    });

    // 1. Manejo de Sesión Expirada (401)
    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.clear();
      location.reload();
      return null;
    }

    // 2. Manejo de Errores (400, 403, 404, 500, etc.)
    if (!res.ok) {
      // Intentamos extraer el mensaje de error que envía el backend (Zod, Prisma, etc.)
      const errorData = await res.json().catch(() => ({}));
      
      // Si el backend envió un mensaje, lo mostramos, si no, uno genérico
      const msg = errorData.message || 'Error en la operación';
      
      showToast(msg, 'error');
      
      // Devolvemos la respuesta para que app.js sepa que res.ok es false
      return res; 
    }

    // 3. Todo OK
    return res;
  } catch (error) {
    console.error('Fetch error:', error);
    showToast('Error de conexión con el servidor', 'error');
    return null;
  }
}

export const authService = {
  async auth(type, email, password) {
    return apiFetch(`/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Generamos un username básico a partir del email para el registro
      body: JSON.stringify({ 
        email, 
        password, 
        username: email.split('@')[0] 
      }),
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