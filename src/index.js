import "./pages/index.css";

import { initialCards } from "./scripts/cards.js";

import {
  cardTemplate,
  createCard,
  removeCard,
  likedButton,
} from "./components/card.js";

import {
  allPopups,
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

const formElement = document.forms["edit-profile"];
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");

const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeEdit = document.querySelector(".popup_type_edit");

const newPlace = document.forms["new-place"];

// Функция добавления новой карточки
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
    likedButton,
  );
  placesList.prepend(newCardElement);

  newPlace.closest(".popup").classList.remove("popup_is-opened");
  evt.target.reset();
}

// Функция открытия поп-апа для картинок
function openImagePopup(item) {
  const popupCaption = popupTypeImage.querySelector(".popup__caption");

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

// @todo: Вывести карточки на страницу
initialCards.forEach(function (item) {
  const eachElement = createCard(
    cardTemplate,
    item,
    removeCard,
    openImagePopup,
    likedButton,
    addNewCard,
  );
  placesList.append(eachElement);
});

// Функция открытия поп-апа редактирования профиля нажатием на карандаш
profileEditButton.addEventListener("click", () => {
  openModal(popupTypeEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});

// Функция открытия поп-апа добавления нового места нажатием на плюсик
profileAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
});

newPlace.addEventListener("submit", addNewCard);

formElement.addEventListener("submit", handleProfileFormSubmit);
