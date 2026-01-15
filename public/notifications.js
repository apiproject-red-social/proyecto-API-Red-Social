export function showToast(message, type = 'success') {
  // Solo mostramos el toast si es un error. 
  // Si es 'success', lo ignoramos para no saturar al usuario (UX limpia).
  if (type === 'success') return; 

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  
  // Colores: Gris muy oscuro con un toque de rojo sutil para errores
  toast.className = `bg-[#1da1f2] text-white px-5 py-2 rounded-full shadow-md flex items-center justify-center min-w-[180px] pointer-events-auto transform transition-all duration-300 ease-out opacity-0 translate-y-2 border border-white/10`;
  
  // Si es error, usamos un tono rojizo oscuro pero elegante
  if (type === 'error') {
    toast.className = `bg-[#e0245e] text-white px-5 py-2 rounded-full shadow-md flex items-center justify-center min-w-[180px] pointer-events-auto transform transition-all duration-300 ease-out opacity-0 translate-y-2`;
  }

  toast.innerHTML = `<span class="text-xs font-medium tracking-tight">${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 50);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      toast.remove();
      if (container.childNodes.length === 0) container.remove();
    }, 300);
  }, 2500); 
}