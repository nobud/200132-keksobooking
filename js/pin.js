// метка на карте
'use strict';

(function () {
  var PIN_INNER_HTML = '<img src="{{avatar}}" class="rounded" width="40" height="40">';
  var PIN_TEG = 'div';
  var PIN_CLASS = 'pin';
  var PIN_ACTIVE_CLASS = 'pin--active';
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;

  // соответствие адреса метки индексу объявления в массиве
  var locationToIndex = {};
  var activePin = null;

  var getParentPinHeight = function (pin) {
    return pin.closest('.tokyo').clientHeight;
  };

  var setPinToIndex = function (location, index) {
    var locationString = location.x + ' ' + location.y;
    locationToIndex[locationString] = index;
  };

  var renderPin = function (offerItem, parentHeight) {
    var element = document.createElement(PIN_TEG);
    var positionPin = window.pin.calcPinMapPosition(offerItem.location, PIN_WIDTH, PIN_HEIGHT, parentHeight);
    element.className = PIN_CLASS;
    element.style.left = positionPin.x + 'px';
    element.style.top = positionPin.y + 'px';
    element.style.zIndex = '100';
    element.innerHTML = PIN_INNER_HTML.replace('{{avatar}}', offerItem.author.avatar);
    element.tabIndex = 0;
    return element;
  };

  window.pin = {
    // вычислить позицию метки на карте с учетом размера метки по заданному адресу
    calcPinMapPosition: function (location, pinWidth, pinHeight, parentHeight) {
      var offsetX = Math.floor(pinWidth / 2);
      var offsetY = pinHeight;
      var position = {};
      position.x = location.x - offsetX;
      position.y = parentHeight - (location.y + offsetY);
      return position;
    },

    // вычислить координаты адреса, на который указывает метка (с учетом ее размера)
    calcPinLocation: function (position, pinWidth, pinHeight, parentHeight) {
      var offsetX = Math.floor(pinWidth / 2);
      var offsetY = pinHeight;
      var location = {};
      location.x = position.x + offsetX;
      location.y = parentHeight - (position.y + offsetY);
      return location;
    },

    // получить индекс объявления, которое соответствует заданной pin (метке)
    getPinIndex: function (pin) {
      // получить адрес (location), которому соответствует метка
      var positionPin = {};
      positionPin.x = pin.offsetLeft;
      positionPin.y = pin.offsetTop;
      var locationPin = this.calcPinLocation(positionPin, pin.clientWidth, pin.clientHeight, getParentPinHeight(pin));
      return locationToIndex[locationPin.x + ' ' + locationPin.y];
    },

    renderPinList: function (offers, parentHeight) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < offers.length; i++) {
        fragment.appendChild(renderPin(offers[i], parentHeight));
        setPinToIndex(offers[i].location, i);
      }
      return fragment;
    },

    getActivePin: function () {
      return activePin;
    },

    // сбросить ранее активную метку
    resetActivePin: function () {
      // снять выделение с ранее активной метки
      if (activePin) {
        activePin.classList.remove(PIN_ACTIVE_CLASS);
        activePin = null;
      }
    },

    // изменить активную метку
    changeActivePin: function (pin) {
      // сбросить ранее активную метку
      this.resetActivePin();
      // сделать активной метку pin
      activePin = pin;
      activePin.classList.add(PIN_ACTIVE_CLASS);
    }
  };
})();
