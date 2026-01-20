export function showSection(sectionId) {
  ['feed-section', 'detail-section', 'profile-section'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('hidden');

  const linkFeed = document.getElementById('link-feed');
  const linkProfile = document.getElementById('link-profile');

  if (linkFeed) {
    linkFeed.classList.toggle(
      'active-link',
      sectionId === 'feed-section' || sectionId === 'detail-section',
    );
  }
  if (linkProfile) {
    linkProfile.classList.toggle('active-link', sectionId === 'profile-section');
  }
}

export function renderComments(comments) {
  if (!comments || comments.length === 0) {
    return '<p class="text-[11px] text-gray-400 py-2">Sin comentarios aún...</p>';
  }
  return comments
    .map(
      (c) => `
      <div class="mb-2 bg-gray-50/50 p-2 rounded-lg">
        <p class="text-[10px] font-bold text-blue-600">@${c.author?.username || 'Anon'}</p>
        <p class="text-xs text-gray-700 leading-tight">${c.content}</p>
      </div>
    `,
    )
    .join('');
}

export function updatePaginationUI(currentPage, totalPosts, limit, onPageClick) {
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  const nums = document.getElementById('page-numbers');
  if (!nums) return;

  nums.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const b = document.createElement('button');
    b.innerText = i;

    const isActive = i === currentPage;
    b.className = `w-9 h-9 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
        : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
    }`;

    b.onclick = () => {
      if (i !== currentPage) {
        onPageClick(i);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    nums.appendChild(b);
  }
}
