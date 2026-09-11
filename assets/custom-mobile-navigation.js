document.addEventListener("DOMContentLoaded", () => {
  const hamburgerButton = document.querySelector(".hamburger-button");
  const mobileMenu = document.getElementById("MobileNavMenu");
  const headerWrapper = document.querySelector(".custom-header");

  if (hamburgerButton && mobileMenu && headerWrapper) {
    hamburgerButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");

      headerWrapper.classList.toggle("is-open");

      // toggle aria-expanded on the button for accessibility
      hamburgerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");

      // toggle visual state on button to swap icons
      hamburgerButton.classList.toggle("is-open", isOpen);
    });
  }
});
