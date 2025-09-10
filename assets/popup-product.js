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

  // Need to add product to our cart

  // Fetch product from shopify by handle
  async function fetchProductByHandle(handle) {
    const response = await fetch(`/products/${handle}.js`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('data: ', data);
    return data;
  }

  // add items to cart

  async function addToCart(items) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to add to cart');
    }
    const data = await response.json();
    console.log('Add to cart response:', data);
    return data;
  }

  // removing case and spacing issues
  function normalizeValue(str) {
    return str ? str.toString().trim().toLowerCase() : '';
  }

  // gather selections and validate (from UI)
  function getSelectedColor(params) {
    const { popup } = params;
    const active = popup.querySelector('.popup__color-option.active');

    if (!active) return null;

    const textSpan = active.querySelector('span:last-child');
    const val = textSpan ? textSpan.textContent.trim() : null;

    console.log('Selected color:', val);
    return val;
  }

  function getSelectedSize(params) {
    const { popup } = params;
    const label = popup.querySelector('.popup__size-trigger.selected');

    if (!label) return null;
    const val = label ? label.textContent.trim() : null;

    console.log('Selected size:', val);
    return val;
  }

  // matching correct variant based on selection from shopify product data
  function findVariantBySelections(params) {
    const { product, selections } = params;

    // Map option names (Size, Color) to their index
    const nameToIndex = {};
    product.options.forEach((opt, idx) => {
      const name = typeof opt === 'string' ? opt : opt.name;
      nameToIndex[normalizeValue(name)] = idx;
    });
    console.log('Option mapping:', nameToIndex);

    // Look through variants and find one matching selections
    const found = product.variants.find((variant) => {
      const opts = variant.options.map((o) => normalizeValue(o));
      return Object.entries(selections).every(([selName, selVal]) => {
        const idx = nameToIndex[normalizeValue(selName)];
        return idx != null && opts[idx] === normalizeValue(selVal);
      });
    });

    console.log('Variant found:', found);
    return found;
  }

  const allPopups = document.querySelectorAll('.popup-overlay');
  allPopups.forEach((popup) => {
    const handle = popup.dataset.productHandle;
    const bonusHandle = popup.dataset.bonusHandle;
    const addToCartButton = popup.querySelector('.popup__cta');
    const buttonTitle = addToCartButton.querySelector('a');

    if (!addToCartButton) return;

    // Click event for add to cart button
    addToCartButton.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      addToCartButton.setAttribute('disabled', 'true');
      buttonTitle.textContent = 'Adding...';

      try {
        const selectedColor = getSelectedColor({ popup });
        const selectedSize = getSelectedSize({ popup });

        if (!selectedColor || !selectedSize) {
          alert('Please select both color and size.');
          addToCartButton.removeAttribute('disabled');
          buttonTitle.textContent = 'Add to Cart';
          return;
        }

        const productJson = await fetchProductByHandle(handle);

        // building slections object
        const selections = {};
        if (selectedColor) selections['color'] = selectedColor;
        if (selectedSize) selections['size'] = selectedSize;

        const variant = findVariantBySelections({
          product: productJson,
          selections,
        });

        if (!variant) {
          alert(
            'The selected combination is unavailable. Please choose another.'
          );
          addToCartButton.removeAttribute('disabled');
          buttonTitle.textContent = 'Add to Cart';
          return;
        }

        if (!variant.available) {
          alert('The selected variant is out of stock. Please choose another.');
          addToCartButton.removeAttribute('disabled');
          buttonTitle.textContent = 'Add to Cart';
          return;
        }

        // builiding cart item
        const items = [{ id: variant.id, quantity: 1 }];

        //  bonus product rule: if black + M, add bonus product
        const isBlackMedium =
          normalizeValue(selectedColor) === 'black' &&
          normalizeValue(selectedSize) === 'm';

        if (isBlackMedium && bonusHandle) {
          try {
            const jacket = await fetchProductByHandle(bonusHandle);
            const jacketVariant =
              (jacket.variants || []).find((v) => v.available) ||
              (jacket.variants || [])[0];

            if (jacketVariant) {
              items.push({
                id: jacketVariant.id,
                quantity: 1,
                properties: { _auto_added_by_rule: 'Black + M trigger' },
              });
            }
          } catch (err) {
            console.warn('Could not load bonus product:', err);
          }
        }

        const result = await addToCart(items);

        // Success feedback
        popup.classList.add('hidden');
        alert('Item added to cart!');
        document.dispatchEvent(
          new CustomEvent('cart:added', { detail: result })
        );
      } catch (err) {
        console.error('Error during add to cart:', err);
        alert(err.message || 'Something went wrong adding to cart.');
      } finally {
        addToCartButton.removeAttribute('disabled');
        buttonTitle.textContent = 'Add to Cart';
      }
    });
  });
});
