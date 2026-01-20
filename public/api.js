import { API_URL } from './config.js';
import { showToast } from './notifications.js';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
    });

    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.clear();
      location.reload();
      return null;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      showToast(data.message || 'Error en la operación', 'error');
      return null;
    }

    data.ok = true;
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
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
    return apiFetch('/users/me');
  },
};

export const userService = {
  async updateProfile(username, email) {
    return apiFetch('/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });
  },
  async changePassword(currentPassword, newPassword) {
    return apiFetch('/users/me/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  async deleteAccount() {
    return apiFetch('/users/me', { method: 'DELETE' });
  },
};

export const postService = {
  async getPosts(page, limit) {
    return apiFetch(`/posts?page=${page}&limit=${limit}`);
  },
  async createPost(content) {
    return apiFetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  },
  async deletePost(postId) {
    return apiFetch(`/posts/${postId}`, { method: 'DELETE' });
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
