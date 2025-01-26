import "./pages/index.css";

import { initialCards } from "./scripts/cards.js";

import {
  createCard,
  removeCard,
  likedButton,
} from "./components/card.js";

import {
  openModal,
  closeModal,
  closePopupOverlay,
} from "./components/modal.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

const profile = document.querySelector(".profile");
const profileInfo = profile.querySelector(".profile__info");
const profileEditButton = profileInfo.querySelector(".profile__edit-button");
const profileAddButton = profile.querySelector(".profile__add-button");
const profileTitle = profileInfo.querySelector(".profile__title");
const profileDescription = profileInfo.querySelector(".profile__description");

const profileEditForm = document.forms["edit-profile"];
const nameInput = profileEditForm.elements.name;
const jobInput = profileEditForm.elements.description;

const allPopups = document.querySelectorAll(".popup");

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");
const popupCaption = popupTypeImage.querySelector(".popup__caption");

const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeEdit = document.querySelector(".popup_type_edit");

const newPlace = document.forms["new-place"];
const cardTemplate = document.querySelector("#card-template").content;

function addNewCard(evt) {
  evt.preventDefault();

  const placeName = newPlace.elements["place-name"];
  const link = newPlace.elements.link;

  const item = {
    name: placeName.value,
    link: link.value,
  };

  const newCardElement = createCard(
    cardTemplate,
    item,
    removeCard,
    openImagePopup,
    likedButton
  );
  placesList.prepend(newCardElement);

  closeModal(popupTypeNewCard); 
  evt.target.reset();
}

// Функция открытия поп-апа для картинок
function openImagePopup(item) {
  popupImage.src = item.link;
  popupImage.alt = item.name;
  popupCaption.textContent = item.name;
  openModal(popupTypeImage);
}

// Функция редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupTypeEdit); 
}

// Функция перебора всех поп-апов для удаления класса popup_is-opened
allPopups.forEach(function (item) {
  const popupCloseButton = item.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", function () {
    closeModal(item); 
  });
  item.addEventListener("click", closePopupOverlay);
  item.classList.add("popup_is-animated");
});

// Выводим карточки на страницу
initialCards.forEach(function (item) {
  const eachElement = createCard(
    cardTemplate,
    item,
    removeCard,
    openImagePopup,
    likedButton,
    addNewCard
  );
  placesList.append(eachElement);
});

// Открытие поп-апа редактирования профиля
profileEditButton.addEventListener("click", () => {
  openModal(popupTypeEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});

// Открытие поп-апа добавления нового места
profileAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
});

newPlace.addEventListener("submit", addNewCard);
profileEditForm.addEventListener("submit", handleProfileFormSubmit);
