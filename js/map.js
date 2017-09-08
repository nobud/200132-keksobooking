'use strict';

(function () {
  var URL_DATA_OFFERS = 'https://1510.dump.academy/keksobooking/data';
  var mapElement = document.querySelector('.tokyo__pin-map');
  var mapHeight = mapElement.parentElement.clientHeight;
  var mapWidth = mapElement.parentElement.clientWidth;
  // данные объявлений
  var dataOffers = [];

  var changePin = function (pin) {
    // установить новую активную метку
    window.pin.changeActivePin(pin);
    // показать карточку с объявлением, соответствующим метке
    window.showCard(dataOffers[window.pin.getPinIndex(pin)]);
  };

  // обработчик клика по метке
  var onPinClick = function (evt) {
    var newPin = evt.target.closest('.pin');
    // если клик по метке и она не является "главной" меткой
    if (newPin && !newPin.classList.contains('pin__main')) {
      changePin(newPin);
    }
  };

  // обработчик нажатия Enter на метке
  var onPinEnterPress = function (evt) {
    var newPin = evt.target;
    if (window.util.isEnterPressed(evt)) {
      if (newPin.classList.contains('pin')) {
        changePin(newPin);
      }
    }
  };

  var renderPinsOnMap = function (data) {
    dataOffers = data;
    // отрисовать метки
    mapElement.appendChild(window.pin.renderPinList(dataOffers));
  };

  var onErrorRenderPins = function (errorMessage) {
    window.message.showError(errorMessage, mapElement, window.util.verticalAlignMessage.top);
  };

  var onMapLoad = function () {
    // получить данные с объявлениями
    window.backend.load(renderPinsOnMap, onErrorRenderPins, URL_DATA_OFFERS);

    // добавить обработчики событий для меток на карте
    mapElement.addEventListener('click', onPinClick);
    mapElement.addEventListener('keydown', onPinEnterPress);
  };

  window.addEventListener('load', onMapLoad);

  window.map = {
    getMapWidth: function () {
      return mapWidth;
    },
    getMapHeight: function () {
      return mapHeight;
    }
  };
})();
