import { state, POSTS_PER_PAGE } from './config.js';
import { postService, authService } from './api.js';
import * as ui from './ui.js';
import { showToast } from './notifications.js';

// --- CARGA DE POSTS ---
async function loadPosts(page) {
  state.currentPage = page;

  // Ahora enviamos POSTS_PER_PAGE para que el backend sepa cuánto saltar (skip)
  const data = await postService.getPosts(page, POSTS_PER_PAGE);
  
  if (!data) return;

  // Ajuste a la nueva estructura de la API: data.posts y data.total
  state.feedPosts = data.posts || [];
  state.totalPosts = data.total || 0;

  if (state.feedPosts.length === 0 && page === 1) {
    console.warn('No hay posts disponibles.');
  }

  const container = document.getElementById('posts-container');
  container.innerHTML = '';

  state.feedPosts.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-6 rounded-2xl border border-gray-200 shadow-sm post-card';
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
        <button class="btn-like flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-red-500" data-id="${p.id}">
          ❤️ <span class="like-count">${p._count?.likes || 0}</span>
        </button>
        <button class="btn-view-detail text-blue-500 hover:bg-blue-50 p-2 rounded-full transition" data-id="${p.id}">💬</button>
      </div>
      <div class="comments-area">${ui.renderComments(p.comments)}</div>
      <div class="flex gap-2 mt-4">
        <input type="text" placeholder="Comentar..." class="flex-1 p-2 text-sm bg-gray-50 border rounded-xl comment-input" data-post-id="${p.id}">
        <button class="btn-send-comment bg-gray-900 text-white px-4 py-1 rounded-xl text-xs font-bold" data-post-id="${p.id}">Enviar</button>
      </div>
    `;
    container.appendChild(div);

    div.querySelector('.btn-view-detail').onclick = () => showPostDetail(p.id);

    div.querySelector('.btn-like').onclick = async () => {
      const res = await postService.toggleLike(p.id);
      if (res.ok) {
        loadPosts(state.currentPage);
      }
    };

    div.querySelector('.btn-send-comment').onclick = async () => {
      const input = div.querySelector('.comment-input');
      if (input.value) {
        const res = await postService.addComment(p.id, input.value);
        if (res.ok) {
          loadPosts(state.currentPage);
        } else {
          showToast('Error al comentar', 'error');
        }
      }
    };
  });

  // La UI de paginación ahora recibe el total real desde el backend
  ui.updatePaginationUI(state.currentPage, state.totalPosts, POSTS_PER_PAGE, loadPosts);
}

// --- DETALLE DE POST ---
async function showPostDetail(postId) {
  const post = state.feedPosts.find((p) => p.id === postId);
  if (!post) return;
  ui.showSection('detail-section');
  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
      <p class="font-bold text-lg mb-2">@${post.author?.username || 'Usuario'}</p>
      <p class="text-xl text-gray-800 mb-6">${post.content}</p>
      <div class="border-t pt-4">
        <h3 class="font-bold mb-4">Comentarios</h3>
        <div class="space-y-3 mb-6">${ui.renderComments(post.comments)}</div>
        <div class="flex gap-2">
          <input type="text" id="detail-comment-input" placeholder="Comentar..." class="flex-1 p-3 bg-gray-50 border rounded-xl">
          <button id="btn-detail-comment" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Enviar</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('btn-detail-comment').onclick = async () => {
    const input = document.getElementById('detail-comment-input');
    if (input.value) {
      const res = await postService.addComment(postId, input.value);
      if (res.ok) {
        loadPosts(state.currentPage).then(() => showPostDetail(postId));
      }
    }
  };
}

// --- PERFIL ---
async function loadProfile() {
  const data = await authService.getMe();
  const user = data.user || data;
  document.getElementById('profile-content').innerHTML = `
    <div class="bg-gray-50 p-6 rounded-2xl">
      <p class="text-sm text-gray-400 font-bold uppercase">Usuario</p>
      <p class="text-lg font-bold mb-4">@${user.username}</p>
      <p class="text-sm text-gray-400 font-bold uppercase">Email</p>
      <p class="text-lg font-bold">${user.email}</p>
    </div>
  `;
}

// --- INICIALIZACIÓN ---
function showApp() {
  document.getElementById('auth-card').classList.add('hidden');
  document.getElementById('app-section').classList.remove('hidden');
  document.getElementById('user-info').classList.remove('hidden');
  document.getElementById('username-display').innerText = localStorage.getItem('username');
  loadPosts(1);
}

document.getElementById('btn-login').onclick = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showToast('Rellena todos los campos', 'error');
    return;
  }

  const res = await authService.auth('login', email, password);

  if (res && res.ok) {
    const data = await res.json();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', data.user.username);
    showApp();
  }
};

document.getElementById('btn-register').onclick = async () => {
  const res = await authService.auth(
    'register',
    document.getElementById('email').value,
    document.getElementById('password').value,
  );
  if (res.ok) {
    showToast('¡Registro exitoso! Ya puedes entrar', 'success');
  }
};

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
  const content = document.getElementById('post-content').value;
  if (!content) return;

  const res = await postService.createPost(content);
  if (res.ok) {
    document.getElementById('post-content').value = '';
    loadPosts(1);
  }
};

document.getElementById('prev-page').onclick = () => loadPosts(state.currentPage - 1);
document.getElementById('next-page').onclick = () => loadPosts(state.currentPage + 1);

if (localStorage.getItem('isLoggedIn') === 'true') showApp();