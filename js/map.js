'use strict';

(function () {
  var mapElement = document.querySelector('.tokyo__pin-map');
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
