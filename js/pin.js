// метка на карте
'use strict';

(function () {
  var PIN_INNER_HTML = '<img src="{{avatar}}" class="rounded" width="40" height="40">';
  var PIN_TEG = 'div';
  var PIN_CLASS = 'pin';
  var PIN_ACTIVE_CLASS = 'pin--active';
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var activePin = null;

  var renderPin = function (offerItem) {
    var element = document.createElement(PIN_TEG);
    var positionPin = window.pin.calcPinMapPosition(offerItem.location, PIN_WIDTH, PIN_HEIGHT);
    element.className = PIN_CLASS;
    element.style.left = positionPin.x + 'px';
    element.style.top = positionPin.y + 'px';
    element.style.zIndex = '100';
    element.innerHTML = PIN_INNER_HTML.replace('{{avatar}}', offerItem.author.avatar);
    element.tabIndex = 0;
    return element;
  };

  window.pin = {
    renderPinList: function (offers) {
      var fragment = document.createDocumentFragment();
      var element;
      offers.forEach(function (offer, i) {
        element = renderPin(offer);
        element.dataset.index = i;
        fragment.appendChild(element);
      });
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
    },

    // вычислить позицию метки на карте по заданному адресу на карте с учетом размера метки
    calcPinMapPosition: function (location, pinWidth, pinHeight) {
      var offsetX = Math.floor(pinWidth / 2);
      var offsetY = pinHeight;
      var position = {
        x: location.x - offsetX,
        y: location.y - offsetY
      };
      return position;
    },

    // вычислить координаты адреса, на который указывает метка (с учетом ее размера)
    calcPinLocation: function (position, pinWidth, pinHeight) {
      var offsetX = Math.floor(pinWidth / 2);
      var offsetY = pinHeight;
      var location = {
        x: position.x + offsetX,
        y: position.y + offsetY
      };
      return location;
    }
  };
})();
