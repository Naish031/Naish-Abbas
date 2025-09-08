document.addEventListener('DOMContentLoaded', () => {
  const popupTriggers = document.querySelectorAll(
    '.product-grid__popup-trigger'
  );

  if (!popupTriggers.length) {
    return;
  }

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetSelector = trigger.getAttribute('data-target');
      const targetPopup = document.querySelector(targetSelector);

      if (targetPopup) {
        targetPopup.classList.remove('hidden');
      }
    });
  });

  const closeButtons = document.querySelectorAll('.popup__close-button');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const popupToClose = button.closest('.popup-overlay');
      if (popupToClose) {
        popupToClose.classList.add('hidden');
      }
    });
  });

  // Logic to close by clicking the background
  const popupOverlays = document.querySelectorAll('.popup-overlay');
  popupOverlays.forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });
});
