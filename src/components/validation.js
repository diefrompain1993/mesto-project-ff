const showInputError = (
  popupFormElement,
  popupInput,
  errorMessage,
  validationConfig,
) => {
  const formError = popupFormElement.querySelector(`.${popupInput.id}-error`);
  popupInput.classList.add(validationConfig.inputErrorClass);
  formError.textContent = errorMessage;
  formError.classList.add(validationConfig.errorClass);
};

export const hideInputError = (formElement, popupInput, validationConfig) => {
  const formError = formElement.querySelector(`.${popupInput.id}-error`);
  popupInput.classList.remove(validationConfig.inputErrorClass);
  if (formError) {
    formError.classList.remove(validationConfig.errorClass);
    formError.textContent = "";
  }
  popupInput.setCustomValidity("");
};

const isValid = (popupFormElement, popupInput, validationConfig) => {
  if (popupInput.validity.patternMismatch) {
    popupInput.setCustomValidity(popupInput.dataset.errorMessage);
  } else {
    popupInput.setCustomValidity("");
  }

  if (!popupInput.validity.valid) {
    showInputError(
      popupFormElement,
      popupInput,
      popupInput.validationMessage,
      validationConfig,
    );
  } else {
    hideInputError(popupFormElement, popupInput, validationConfig);
  }
};

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (inputList.some((popupInput) => !popupInput.validity.valid)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const setEventListeners = (popupFormElement, validationConfig) => {
  const inputList = Array.from(
    popupFormElement.querySelectorAll(validationConfig.popupInput),
  );
  const buttonElement = popupFormElement.querySelector(
    validationConfig.buttonElement,
  );
  toggleButtonState(inputList, buttonElement, validationConfig);
  inputList.forEach((popupInput) => {
    popupInput.addEventListener("input", () => {
      isValid(popupFormElement, popupInput, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

export const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.popupFormElement),
  );
  formList.forEach((popupFormElement) => {
    setEventListeners(popupFormElement, validationConfig);
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((popupInput) => !popupInput.validity.valid);
};

export const clearValidation = (popupFormElement, validationConfig) => {
  const inputList = Array.from(
    popupFormElement.querySelectorAll(validationConfig.popupInput),
  );
  const buttonElement = popupFormElement.querySelector(
    validationConfig.buttonElement,
  );

  inputList.forEach((popupInput) => {
    hideInputError(popupFormElement, popupInput, validationConfig);
  });

  toggleButtonState(inputList, buttonElement, validationConfig);
};
