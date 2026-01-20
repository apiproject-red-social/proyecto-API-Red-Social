export function showToast(message, type = 'success') {
  
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex flex-col gap-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  
  const bgColor = type === 'error' ? 'bg-[#e0245e]' : 'bg-[#1da1f2]';
  
  toast.className = `${bgColor} text-white px-6 py-3 rounded-full shadow-2xl flex items-center justify-center min-w-[200px] pointer-events-auto transform transition-all duration-300 ease-out opacity-0 translate-y-4 text-sm font-bold`;

  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}