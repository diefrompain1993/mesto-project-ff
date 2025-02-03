import { putLike, deleteLike } from "./api.js";

// @todo: Темплейт карточки
export const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
export function createCard(
  cardTemplate,
  item,
  openImagePopup,
  likedButton,
  profileResult,
  deleteCardServer,
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const likesCounter = cardTemplate.querySelector(".likes__counter");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;
  likesCounter.textContent = item.likes.length;

  // Скрыть кнопку удаления, если карточку загрузил не я
  if (profileResult._id !== item.owner._id) {
    deleteButton.classList.add("inactive");
  }

  // Закрасить кнопку лайка там, где я его поставил
  if (item.likes.some((like) => like._id === profileResult._id)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  // Вызов функции удаления карточки с сервера
  deleteButton.addEventListener("click", function (evt) {
    deleteCardServer(item._id)
      .then(() => {
        removeCard(evt);
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  });

  // Вызов функции постановки лайка
  cardLikeButton.addEventListener("click", function (evt) {
    likedButton(evt, item, likesCounter);
  });

  // Вызов функции открытия картинки у карточки
  cardImage.addEventListener("click", function () {
    openImagePopup(item);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
export function removeCard(evt) {
  const listItem = evt.target.closest(".places__item");
  listItem.remove();
}

// Функция лайка
export function likedButton(evt, item, likesCounter) {
  if (evt.target.classList.contains("card__like-button_is-active")) {
    deleteLike(item._id)
      .then((res) => {
        evt.target.classList.remove("card__like-button_is-active");
        likesCounter.textContent = res.likes.length;
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  } else {
    putLike(item._id)
      .then((res) => {
        evt.target.classList.add("card__like-button_is-active");
        likesCounter.textContent = res.likes.length;
        console.log(item.likes);
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }
}
