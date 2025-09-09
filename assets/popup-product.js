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

  // Select Down Logic
  const sizeSelectTriggerWrappers = document.querySelectorAll(
    '.popup__size-trigger-wrapper'
  );
  if (!sizeSelectTriggerWrappers) return;

  sizeSelectTriggerWrappers.forEach((wrapper) => {
    const sizeSelectOptions = wrapper.querySelector('.popup__size-options');

    const sizeOptions = wrapper.querySelectorAll('.popup__size-option');

    const arrow = wrapper.querySelector('.icon-arrow-down');
    const triggerLabel = wrapper.querySelector('.popup__size-trigger');

    // enhance accessibility
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-haspopup', 'listbox');
    wrapper.setAttribute('aria-expanded', 'false');

    wrapper.addEventListener('click', function (event) {
      event.stopPropagation();

      const isOpen = sizeSelectOptions.classList.toggle('is-open');

      if (arrow) arrow.classList.toggle('rotate-180', isOpen);
    });

    sizeOptions.forEach((option) => {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        triggerLabel.textContent = option.textContent;
        triggerLabel.classList.add('selected');

        sizeSelectOptions.classList.remove('is-open');
        if (arrow) arrow.classList.remove('rotate-180');
      });
    });
  });

  // Close the size select if clicking outside of it
  window.addEventListener('click', function () {
    sizeSelectTriggerWrappers.forEach((wrapper) => {
      const sizeSelectOptions = wrapper.querySelector('.popup__size-options');
      const arrow = wrapper.querySelector('.icon-arrow-down');

      if (sizeSelectOptions.classList.contains('is-open')) {
        sizeSelectOptions.classList.remove('is-open');
        if (arrow) arrow.classList.remove('rotate-180');
      }
    });
  });

  const initColorSliders = () => {
    // Find all the color option containers within all popups
    const colorGroups = document.querySelectorAll('.popup__color-options');

    colorGroups.forEach((container) => {
      const options = container.querySelectorAll('.popup__color-option');
      const slider = container.querySelector('.color-slider');

      if (!slider || !options.length) return;

      options.forEach((option, index) => {
        option.addEventListener('click', () => {
          // On first click, just make the slider appear without transition
          if (!container.querySelector('.active')) {
            slider.style.transition = 'none';
          } else {
            slider.style.transition = 'transform 0.3s ease-in-out';
          }

          // Remove active class from all options
          options.forEach((opt) => opt.classList.remove('active'));
          // Add active class to the clicked one
          option.classList.add('active');

          // Calculate the new position for the slider
          const newPosition = index * option.offsetWidth;
          slider.style.transform = `translateX(${newPosition}px)`;
          slider.style.opacity = '1';
        });
      });
    });
  };
  initColorSliders();
});
