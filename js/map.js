'use strict';

(function () {
  // количество произвольных вариантов, которые показываются по умолчанию при открытии страницы
  var DEFAULT_COUNT_PINS = 3;
  var URL_DATA_OFFERS = 'https://1510.dump.academy/keksobooking/data';
  var mapElement = document.querySelector('.tokyo__pin-map');
  var mapHeight = mapElement.parentElement.clientHeight;
  var mapWidth = mapElement.parentElement.clientWidth;
  // массив всех объявлений
  var dataOffers = [];
  // массив отрисованных объявлений (массив объявлений, для которых отрисованы метки на карте)
  var dataRenderedOffers = [];

  var deletePinEvent = new CustomEvent('deleteActivePin', {
    bubbles: true,
    cancellable: false
  });

  var changePin = function (pin) {
    // установить новую активную метку
    window.pin.changeActivePin(pin);
    // показать карточку с объявлением, соответствующим метке
    window.showCard(dataRenderedOffers[pin.dataset.index]);
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
  };

  // отрисовать метки на карте
  var renderPinsOnMap = function (someOffers) {
    dataRenderedOffers = someOffers;
    mapElement.appendChild(window.pin.renderPinList(someOffers));
  };

  var deleteCurrentPins = function () {
    var allPins = mapElement.querySelectorAll('.pin');
    var activePin = window.pin.getActivePin();
    var mainPin = mapElement.querySelector('.pin__main');

    Array.prototype.forEach.call(allPins, function (pin) {
      if (pin !== mainPin) {
        if (pin === activePin) {
          window.dispatchEvent(deletePinEvent);
        }
        mapElement.removeChild(pin);
      }
    });
  };

  var onUpdateFilter = function (evt) {
    deleteCurrentPins();
    renderPinsOnMap(evt.detail.data);
  };

  // получить список нескольких случайно выбранных объектов
  var getDefaultObjects = function () {
    var indexList = window.util.getRandomUniqValues(0, dataOffers.length - 1, DEFAULT_COUNT_PINS);
    var defaultOffers = [];
    indexList.forEach(function (it) {
      defaultOffers.push(dataOffers[it]);
    });
    return defaultOffers;
  };

  var onSuccessDataLoad = function (data) {
    // сохранить полный список объектов
    saveDataOffers(data);
    renderPinsOnMap(getDefaultObjects());
  };

  var onErrorDataLoad = function (errorMessage) {
    window.message.showError(errorMessage, mapElement, window.message.verticalAlignMessage.top);
  };

  var onMapLoad = function () {
    // получить данные с объявлениями и сохранить их
    window.backend.load(onSuccessDataLoad, onErrorDataLoad, URL_DATA_OFFERS);
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
