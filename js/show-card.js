'use strict';

(function () {
  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');

  // изменить активное объявление
  var changeActiveOffer = function (offer) {
    // отобразить данные выбранного объявления в диалоговом окне
    window.card.renderOffer(offer, dialogElement);
  };

  // закрыть окно с активным объявлением
  var closeActiveOffer = function () {
    var lastFocusedPin = window.pin.getActivePin();
    // сбросить активную метку
    window.pin.resetActivePin();
    // удалить обработчики
    dialogCloseElement.removeEventListener('click', onDialogCloseClick);
    dialogCloseElement.removeEventListener('keydown', onDialogCloseEnterPress);
    document.removeEventListener('keydown', onDialogEscPress);
    // скрыть диалоговое окно
    dialogElement.classList.add('hidden');
    if (lastFocusedPin) {
      lastFocusedPin.focus();
    }
  };

  // обработчик клика по кнопке закрытия окна карточки объявления
  var onDialogCloseClick = function () {
    closeActiveOffer();
  };

  // обработчик нажатия Enter на кнопке закрытия окна карточки объявления
  var onDialogCloseEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      closeActiveOffer();
    }
  };

  // обработчик нажатия ESC при открытом диалоговом окне (закрыть диалоговое окно)
  var onDialogEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeActiveOffer();
    }
  };

  // открыть окно с активным объявлением
  window.showCard = function (offer) {
    // отобразить данные объявления, соответствующие активной метке
    changeActiveOffer(offer);
    // добавить обработчики
    dialogCloseElement.addEventListener('click', onDialogCloseClick);
    dialogCloseElement.addEventListener('keydown', onDialogCloseEnterPress);
    document.addEventListener('keydown', onDialogEscPress);
    // показать диалоговое окно
    dialogElement.classList.remove('hidden');
    dialogElement.focus();
  };
})();
