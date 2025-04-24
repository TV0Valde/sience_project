export function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const messageEl = document.getElementById('errorModalMessage');
  const closeBtn = document.getElementById('errorModalClose');

  messageEl.textContent = message;
  modal.style.display = 'block';

  function close() {
      modal.style.display = 'none';
      closeBtn.removeEventListener('click', close);
      window.removeEventListener('click', onWindowClick);
  }

  function onWindowClick(e) {
      if (e.target === modal) {
          close();
      }
  }

  closeBtn.addEventListener('click', close);
  window.addEventListener('click', onWindowClick);
}
