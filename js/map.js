'use strict';

(function () {
  var mapElement = document.querySelector('.tokyo__pin-map');
  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');
  // данные объявлений
  var dataOffers = [];

  // изменить активное объявление
  var changeActiveOffer = function (newPin) {
    // узнать индекс объявления и отобразить данные выбранного объявления в диалоговом окне
    window.card.renderOffer(dataOffers[window.pin.getPinIndex(newPin)], dialogElement);
  };

  // открыть окно с активным объявлением
  var openActiveOffer = function (newPin) {
    // установить новую активную метку
    window.pin.changeActivePin(newPin);
    // отобразить данные объявления, соответствующие активной метке
    changeActiveOffer(newPin);
    // добавить обработчики
    dialogCloseElement.addEventListener('click', onDialogCloseClick);
    dialogCloseElement.addEventListener('keydown', onDialogCloseEnterPress);
    document.addEventListener('keydown', onDialogEscPress);
    // показать диалоговое окно
    dialogElement.classList.remove('hidden');
    dialogElement.focus();
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

  // обработчик клика по метке
  var onPinClick = function (evt) {
    var pin = evt.target.closest('.pin');
    // если клик по метке и она не является "главной" меткой
    if (pin && !pin.classList.contains('pin__main')) {
      openActiveOffer(pin);
    }
  };

  // обработчик нажатия Enter на метке
  var onPinEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      if (evt.target.className === 'pin') {
        openActiveOffer(evt.target);
      }
    }
  };

  // обработчик клика по кнопке закрытия окна
  var onDialogCloseClick = function () {
    closeActiveOffer();
  };

  // обработчик нажатия Enter на кнопке закрытия окна
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

  var onMapLoad = function () {
    // получить данные с объявлениями
    dataOffers = window.data.getValues();
    // отрисовать метки
    mapElement.appendChild(window.pin.renderPinList(dataOffers));
    // добавить обработчики событий для меток на карте
    mapElement.addEventListener('click', onPinClick);
    mapElement.addEventListener('keydown', onPinEnterPress);
  };

  window.addEventListener('load', onMapLoad);
})();
