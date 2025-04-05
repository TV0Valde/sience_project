export function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
    setTimeout(() => errorMessage.classList.remove('visible'), 3000);
  }