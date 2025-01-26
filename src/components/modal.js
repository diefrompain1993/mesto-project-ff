export const allPopups = document.querySelectorAll(".popup");

export function openModal(item) {
  item.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeByEsc);
}

export function closeModal(item) {
  item.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeByEsc);
}

export function closeByEsc(evt) {
  if (evt.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}

export function closePopupOverlay(evt) {
  if (evt.currentTarget === evt.target) {
    closeModal(evt.target);
  }
}
