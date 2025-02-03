// Данные для успешной авторизации на сервере
export const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-30",
  headers: {
    authorization: "2acff074-5445-48a3-9f5a-ba8d36b1cf4b",
    "Content-Type": "application/json",
  },
};

// Функция обработки ответа от сервера
export const getResponse = (result) => {
  if (result.ok) {
    return result.json();
  }
  return Promise.reject(`Ошибка: ${result.status}`);
};

// Функция загрузки информации о пользователе с сервера
export function loadingProfileInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "GET",
    headers: config.headers,
  }).then(getResponse);
}

// Функция загрузки карточек с сервера
export function loadingCardsInfo() {
  return fetch(`${config.baseUrl}/cards `, {
    method: "GET",
    headers: config.headers,
  }).then(getResponse);
}

// Функция редактирования профиля с сервера
export function patchEditProfile(nameInput, jobInput) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: nameInput,
      about: jobInput,
    }),
  });
}

// Функция отправки данных карточки на сервер
export function postNewCard(placeName, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: placeName,
      link: link,
    }),
  }).then(getResponse);
}

// Функция загрузки лайков
export function loadingLikesQuantity() {
  return fetch(`${config.baseUrl}/cards`, {
    method: "GET",
    headers: config.headers,
  }).then(getResponse);
}

// Функция удаления карточки с сервера
export function deleteCardServer(id) {
  return fetch(`${config.baseUrl}/cards/${id}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponse);
}

// Функция удаления лайка
export function deleteLike(id) {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponse);
}

// Функция постановки лайка
export function putLike(id) {
  return fetch(`${config.baseUrl}/cards/likes/${id}`, {
    method: "PUT",
    headers: config.headers,
  }).then(getResponse);
}

// Функция изменения аватара
export function patchAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
  }).then(getResponse);
}
