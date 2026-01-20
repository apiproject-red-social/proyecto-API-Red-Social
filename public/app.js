import { state, POSTS_PER_PAGE } from './config.js';
import { postService, authService, userService } from './api.js';
import * as ui from './ui.js';
import { showToast } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isLoggedIn') === 'true') showApp();
  setupEventListeners();
});

function showApp() {
  document.getElementById('auth-card').classList.add('hidden');
  document.getElementById('app-section').classList.remove('hidden');
  document.getElementById('user-info').classList.remove('hidden');
  document.getElementById('username-display').innerText = localStorage.getItem('username');
  loadPosts(1);
}

async function loadPosts(page) {
  state.currentPage = page;
  const data = await postService.getPosts(page, POSTS_PER_PAGE);
  if (!data) return;

  state.feedPosts = data.posts || [];
  state.totalPosts = data.total || 0;

  const container = document.getElementById('posts-container');
  container.innerHTML = '';
  state.feedPosts.forEach((post) => container.appendChild(createPostElement(post)));

  ui.updatePaginationUI(state.currentPage, state.totalPosts, POSTS_PER_PAGE, loadPosts);
}

function createPostElement(p) {
  const currentUserId = localStorage.getItem('userId');
  const isOwner = p.authorId === currentUserId || (p.author && p.author.id === currentUserId);

  const div = document.createElement('div');
  div.className = 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm post-card relative';
  div.innerHTML = `
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
          ${(p.author?.username || 'U').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <span class="font-bold block text-sm">@${p.author?.username || 'Usuario'}</span>
          <span class="text-[10px] text-gray-400">${new Date(p.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    <p class="text-gray-700 mb-4 text-base">${p.content}</p>
    <div class="flex items-center gap-4 py-2 border-t border-b border-gray-50 mb-4">
      <button class="btn-like flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
        ❤️ <span class="like-count">${p._count?.likes || 0}</span>
      </button>
      <button class="btn-view-detail text-blue-500 hover:bg-blue-50 p-2 rounded-full transition">💬 Detalle</button>
      ${isOwner ? `<button class="btn-delete-post text-gray-300 hover:text-red-500 p-1 transition-colors">🗑️</button>` : ''}
      </div>
    <div class="comments-area">${ui.renderComments(p.comments)}</div>
    
    <div class="flex gap-2 mt-4">
      <input type="text" placeholder="Escribe un comentario..." class="flex-1 p-2 text-sm bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 comment-input">
      <button class="btn-send-comment bg-gray-900 text-white px-4 py-1 rounded-xl text-xs font-bold hover:bg-black transition">Enviar</button>
    </div>
  `;

  div.querySelector('.btn-view-detail').onclick = () => showPostDetail(p.id);

  div.querySelector('.btn-like').onclick = async () => {
    if (await postService.toggleLike(p.id)) loadPosts(state.currentPage);
  };

  div.querySelector('.btn-send-comment').onclick = async () => {
    const input = div.querySelector('.comment-input');
    const content = input.value.trim();
    if (!content) return;

    if (await postService.addComment(p.id, content)) {
      showToast('Comentario enviado');
      loadPosts(state.currentPage);
    }
  };

  if (isOwner) {
    div.querySelector('.btn-delete-post').onclick = async () => {
      if (confirm('¿Eliminar publicación?')) {
        if (await postService.deletePost(p.id)) {
          showToast('Publicación eliminada');
          loadPosts(state.currentPage);
        }
      }
    };
  }
  return div;
}

async function handleAuth(type) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) return showToast('Rellena los campos', 'error');

  const data = await authService.auth(type, email, password);
  if (data) {
    if (type === 'login') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user.id);
      showApp();
      showToast('Sesión iniciada');
    } else {
      showToast('Registro completado', 'success');
    }
  }
}

async function loadProfile() {
  const data = await authService.getMe();
  if (!data) return;
  const user = data.user || data;

  document.getElementById('profile-content').innerHTML = `
    <div class="space-y-4">
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Usuario</label>
        <input type="text" id="edit-username" value="${user.username}" class="w-full p-3 bg-gray-50 border rounded-xl outline-none">
      </div>
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Email</label>
        <input type="email" id="edit-email" value="${user.email}" class="w-full p-3 bg-gray-50 border rounded-xl outline-none">
      </div>
      <button id="btn-save-profile" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Guardar Cambios</button>
    </div>
  `;

  document.getElementById('btn-save-profile').onclick = async () => {
    const res = await userService.updateProfile(
      document.getElementById('edit-username').value,
      document.getElementById('edit-email').value,
    );
    if (res) {
      localStorage.setItem('username', res.user?.username || res.username);
      showToast('Perfil actualizado');
      setTimeout(() => location.reload(), 800);
    }
  };
}

async function showPostDetail(postId) {
  const post = state.feedPosts.find((p) => p.id === postId);
  if (!post) return;
  ui.showSection('detail-section');

  document.getElementById('detail-content').innerHTML = `
    <div class="bg-white p-6 rounded-2xl border shadow-sm">
      <p class="font-bold mb-4">@${post.author?.username}</p>
      <p class="text-gray-800 text-lg mb-6">${post.content}</p>
      <div class="border-t pt-4">
        <div id="detail-comments" class="space-y-2 mb-4">${ui.renderComments(post.comments)}</div>
        <div class="flex gap-2">
          <input type="text" id="det-comment-in" placeholder="Comentar..." class="flex-1 p-3 bg-gray-50 border rounded-xl outline-none">
          <button id="det-comment-btn" class="bg-gray-900 text-white px-6 rounded-xl font-bold">Enviar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('det-comment-btn').onclick = async () => {
    const input = document.getElementById('det-comment-in');
    const val = input.value.trim();
    if (!val) return;

    if (await postService.addComment(postId, val)) {
      showToast('Comentario añadido');
      await loadPosts(state.currentPage);
      const updatedPost = state.feedPosts.find((p) => p.id === postId);
      document.getElementById('detail-comments').innerHTML = ui.renderComments(
        updatedPost.comments,
      );
      input.value = '';
    }
  };
}

function setupEventListeners() {
  document.getElementById('btn-login').onclick = () => handleAuth('login');
  document.getElementById('btn-register').onclick = () => handleAuth('register');
  document.getElementById('btn-logout').onclick = () => {
    localStorage.clear();
    location.reload();
  };
  document.getElementById('link-feed').onclick = () => ui.showSection('feed-section');
  document.getElementById('link-profile').onclick = () => {
    ui.showSection('profile-section');
    loadProfile();
  };
  document.getElementById('back-feed').onclick = () => ui.showSection('feed-section');

  document.getElementById('btn-publish').onclick = async () => {
    const input = document.getElementById('post-content');
    if (await postService.createPost(input.value.trim())) {
      showToast('Publicado');
      input.value = '';
      loadPosts(1);
    }
  };

  document.getElementById('btn-change-pass').onclick = async () => {
    const current = document.getElementById('current-pass').value;
    const next = document.getElementById('new-pass').value;
    if (await userService.changePassword(current, next)) {
      showToast('Contraseña actualizada');
      document.getElementById('current-pass').value = '';
      document.getElementById('new-pass').value = '';
    }
  };

  document.getElementById('btn-delete-account').onclick = async () => {
    if (confirm('¿Eliminar cuenta permanentemente?')) {
      if (await userService.deleteAccount()) {
        localStorage.clear();
        location.reload();
      }
    }
  };

  document.getElementById('prev-page').onclick = () => loadPosts(state.currentPage - 1);
  document.getElementById('next-page').onclick = () => loadPosts(state.currentPage + 1);
}
