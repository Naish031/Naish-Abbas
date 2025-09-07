window.addEventListener("DOMContentLoaded", function () {
  const sizeSelectTriggerWrapper = document.querySelector(
    ".popup__size-trigger-wrapper"
  );
  if (!sizeSelectTriggerWrapper) return;

  const sizeSelectOptions = document.querySelector(".popup__size-options");
  if (!sizeSelectOptions) return;

  const sizeOptions = Array.from(
    document.querySelectorAll(".popup__size-option")
  );
  const arrow = sizeSelectTriggerWrapper.querySelector(".icon-arrow-down");
  const triggerLabel = sizeSelectTriggerWrapper.querySelector(
    ".popup__size-trigger"
  );

  // enhance accessibility
  sizeSelectTriggerWrapper.setAttribute("role", "button");
  sizeSelectTriggerWrapper.setAttribute("aria-haspopup", "listbox");
  sizeSelectTriggerWrapper.setAttribute("aria-expanded", "false");

  // attach option click handlers once
  sizeOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      sizeOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      if (triggerLabel) triggerLabel.textContent = option.textContent;
      // close with animation
      sizeSelectOptions.classList.remove("is-open");
      sizeSelectTriggerWrapper.setAttribute("aria-expanded", "false");
      if (arrow) arrow.classList.remove("rotate-180");
    });
  });

  // toggle open/close on trigger
  sizeSelectTriggerWrapper.addEventListener("click", function (e) {
    const isOpen = sizeSelectOptions.classList.toggle("is-open");
    sizeSelectTriggerWrapper.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
    if (arrow) arrow.classList.toggle("rotate-180", isOpen);
  });

  // close on outside click
  window.addEventListener("click", function (e) {
    if (
      !sizeSelectTriggerWrapper.contains(e.target) &&
      !sizeSelectOptions.contains(e.target)
    ) {
      sizeSelectOptions.classList.remove("is-open");
      sizeSelectTriggerWrapper.setAttribute("aria-expanded", "false");
      if (arrow) arrow.classList.remove("rotate-180");
    }
  });

  // keyboard support: close on Escape
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      sizeSelectOptions.classList.remove("is-open");
      sizeSelectTriggerWrapper.setAttribute("aria-expanded", "false");
      if (arrow) arrow.classList.remove("rotate-180");
    }
  });
});
