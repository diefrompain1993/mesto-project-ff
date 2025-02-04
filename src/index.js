import "./pages/index.css";

import { cardTemplate, createCard, likedButton } from "./components/card.js";

import {
  openModal,
  closeModal,
  closePopupOverlay,
} from "./components/modal.js";

import { enableValidation, clearValidation } from "./components/validation.js";

import {
  loadingProfileInfo,
  loadingCardsInfo,
  patchEditProfile,
  postNewCard,
  deleteCardServer,
  patchAvatar,
} from "./components/api.js";

const allPopups = document.querySelectorAll(".popup");

// Объект настроек валидации
const validationConfig = {
  popupFormElement: ".popup__form",
  popupInput: ".popup__input",
  buttonElement: ".popup__button",
  inactiveButtonClass: ".popup__button_disabled",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

const profile = document.querySelector(".profile");
const profileInfo = profile.querySelector(".profile__info");
const profileEditButton = profileInfo.querySelector(".profile__edit-button");
const profileAddButton = profile.querySelector(".profile__add-button");
const profileTitle = profileInfo.querySelector(".profile__title");
const profileDescription = profileInfo.querySelector(".profile__description");
const profileImage = profile.querySelector(".profile__image");

const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const jobInput = profileForm.elements.description;

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = popupTypeImage.querySelector(".popup__image");
const imagePopupCaption = popupTypeImage.querySelector(".popup__caption");

const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeEdit = document.querySelector(".popup_type_edit");

const newPlace = document.forms["new-place"];
const placeName = newPlace.elements["place-name"];
const link = newPlace.elements.link;

const popupAvatar = document.querySelector(".popup_type_avatar");
const profileAvatar = document.querySelector(".profile__image");
const avatarForm = document.forms["avatar-form"];
const avatarInputUrl = avatarForm.elements.link;

/**
 * Утилитарная функция для изменения состояния кнопки.
 * @param {HTMLElement} button
 * @param {boolean} isLoading
 * @param {string} defaultText
 */

function renderLoading(button, isLoading, defaultText) {
  button.textContent = isLoading ? "Сохранение..." : defaultText;
}

// Функция добавления новой карточки
function addNewCard(evt) {
  evt.preventDefault();
  const formButton = evt.submitter;
  const defaultTextButton = formButton.textContent;
  renderLoading(formButton, true, defaultTextButton);

  postNewCard(placeName.value, link.value)
    .then((item) => {
      const newCardElement = createCard(
        cardTemplate,
        item,
        openImagePopup,
        likedButton,
        item.owner,
        deleteCardServer,
      );
      placesList.prepend(newCardElement);
      closeModal(popupTypeNewCard);
      evt.target.reset();
      clearValidation(popupTypeNewCard, validationConfig);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      renderLoading(formButton, false, defaultTextButton);
    });
}

// Функция открытия поп-апа для картинок
function openImagePopup(item) {
  popupImage.src = item.link;
  popupImage.alt = item.name;
  imagePopupCaption.textContent = item.name;
  openModal(popupTypeImage);
}

// Функция редактирования профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const formButton = evt.submitter;
  const defaultTextButton = formButton.textContent;
  renderLoading(formButton, true, defaultTextButton);

  patchEditProfile(nameInput.value, jobInput.value)
    .then((data) => {
      const updatedName = data && data.name ? data.name : nameInput.value;
      const updatedAbout = data && data.about ? data.about : jobInput.value;
      profileTitle.textContent = updatedName;
      profileDescription.textContent = updatedAbout;
      closeModal(popupTypeEdit);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      renderLoading(formButton, false, defaultTextButton);
    });
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

// Вывод данных о профиле и карточках с сервера
Promise.all([loadingProfileInfo(), loadingCardsInfo()])
  .then(([profileResult, cardsResult]) => {
    console.log(profileResult);
    console.log(cardsResult);

    profileTitle.textContent = profileResult.name;
    profileDescription.textContent = profileResult.about;
    profileImage.style.backgroundImage = `url(${profileResult.avatar})`;

    // Вывод карточек на страницу
    cardsResult.forEach(function (item) {
      const eachElement = createCard(
        cardTemplate,
        item,
        openImagePopup,
        likedButton,
        profileResult,
        deleteCardServer,
      );
      placesList.append(eachElement);
    });
  })
  .catch((error) => {
    console.log(`Ошибка: ${error}`);
  });

// Функция очистки полей формы
export const clearState = (inputElement) => {
  const inputList = Array.from(
    inputElement.querySelectorAll(validationConfig.popupInput),
  );
  inputList.forEach((popupInput) => {
    popupInput.value = "";
  });
};

avatarForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const formButton = evt.submitter;
  const defaultTextButton = formButton.textContent;
  renderLoading(formButton, true, defaultTextButton);
  patchAvatar(avatarInputUrl.value)
    .then((result) => {
      profileAvatar.style.backgroundImage = `url(${result.avatar})`;
      closeModal(popupAvatar);
      evt.target.reset();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      renderLoading(formButton, false, defaultTextButton);
    });
});

// Вызов функции открытия поп-апа редактирования профиля при клике на карандаш
profileEditButton.addEventListener("click", () => {
  openModal(popupTypeEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
});

// Вызов функции открытия поп-апа добавления нового места при клике на плюсик
profileAddButton.addEventListener("click", () => {
  openModal(popupTypeNewCard);
  clearValidation(popupTypeNewCard, validationConfig);
  clearState(popupTypeNewCard);
});

// Вызов функции открытия поп-апа аватара при клике на изображение профиля
profileImage.addEventListener("click", function () {
  openModal(popupAvatar);
  clearValidation(avatarForm, validationConfig);
  clearState(popupAvatar);
});

// Вызов функции добавления новой карточки
newPlace.addEventListener("submit", addNewCard);

// Вызов функции редактирования профиля
profileForm.addEventListener("submit", handleProfileFormSubmit);

// Вызов функции включения валидации всех форм
enableValidation(validationConfig);
