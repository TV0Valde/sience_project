export function showErrorModal(message) {
  let warningPointModal = document.getElementById('warningPointModal');
  let warningPointModalMessage = document.getElementById('warningPointModalMessage');
    warningPointModal.style.display = 'block';
    warningPointModalMessage.textContent = message;
    setTimeout(() => warningPointModal.style.display = 'none', 3000);
  }