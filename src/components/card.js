export function createCard(
  cardTemplate,
  item,
  removeCard,
  openImagePopup,
  likedButton
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  deleteButton.addEventListener("click", removeCard);
  cardImage.addEventListener("click", function () {
    openImagePopup(item); 
  });
  cardLikeButton.addEventListener("click", likedButton);

  return cardElement;
}

export function removeCard(evt) {
  const listItem = evt.target.closest(".places__item");
  listItem.remove();
}

export function likedButton(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}
