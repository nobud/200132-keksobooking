'use strict';

(function () {
  var URL_DATA_OFFERS = 'https://1510.dump.academy/keksobooking/data';
  var mapElement = document.querySelector('.tokyo__pin-map');
  var mapHeight = mapElement.parentElement.clientHeight;
  var mapWidth = mapElement.parentElement.clientWidth;
  // массив объявлений
  var dataOffers = [];
  // массив координат объявлений на карте (location)
  var offerLocations = [];

  var deletePinEvent = new CustomEvent('deleteActivePin', {
    bubbles: true,
    cancellable: false
  });

  var getLocationStr = function (location) {
    return location.x + ' ' + location.y;
  };

  // получить индекс объявления, которое соответствует заданной pin (метке)
  var getPinIndex = function (pin) {
    // получить адрес на карте (location), которому соответствует метка
    var positionPin = {};
    positionPin.x = pin.offsetLeft;
    positionPin.y = pin.offsetTop;
    var locationPin = window.pin.calcPinLocation(positionPin, pin.clientWidth, pin.clientHeight);
    return offerLocations.indexOf(getLocationStr(locationPin));
  };

  var changePin = function (pin) {
    // установить новую активную метку
    window.pin.changeActivePin(pin);
    // показать карточку с объявлением, соответствующим метке
    window.showCard(dataOffers[getPinIndex(pin)]);
  };

  var setOfferLocations = function () {
    offerLocations = dataOffers.map(function (offerItem) {
      return getLocationStr(offerItem.location);
    });
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

  // сохранить данные объявлений
  var saveDataOffers = function (data) {
    dataOffers = data;
    setOfferLocations();
  };

  // отрисовать метки на карте
  var renderPinsOnMap = function (someOffers) {
    mapElement.appendChild(window.pin.renderPinList(someOffers));
  };

  var onErrorRenderPins = function (errorMessage) {
    window.message.showError(errorMessage, mapElement, window.message.verticalAlignMessage.top);
  };

  var deleteCurrentPins = function () {
    var allPins = mapElement.querySelectorAll('.pin');
    var pinsOffer = Array.from(allPins).filter(function (pin) {
      return !pin.classList.contains('pin__main');
    });
    Array.from(pinsOffer).forEach(function (pin) {
      if (pin === window.pin.getActivePin()) {
        window.dispatchEvent(deletePinEvent);
      }
      mapElement.removeChild(pin);
    });

  };

  var onUpdateFilter = function (evt) {
    deleteCurrentPins();
    renderPinsOnMap(evt.detail.data);
  };

  var onSuccessDataLoad = function (data) {
    renderPinsOnMap(data);
    saveDataOffers(data);
  };

  var onMapLoad = function () {
    // получить данные с объявлениями и сохранить их
    window.backend.load(onSuccessDataLoad, onErrorRenderPins, URL_DATA_OFFERS);
    // обработчики событий для меток на карте
    mapElement.addEventListener('click', onPinClick);
    mapElement.addEventListener('keydown', onPinEnterPress);
    // обработчик обновления фильтра
    window.addEventListener('updateFilter', onUpdateFilter);
  };

  window.addEventListener('load', onMapLoad);

  window.map = {
    getMapWidth: function () {
      return mapWidth;
    },
    getMapHeight: function () {
      return mapHeight;
    },
    getDataOffers: function () {
      return dataOffers;
    }
  };
})();
