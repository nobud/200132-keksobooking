// метка на карте
'use strict';

(function () {
  var PIN_INNER_HTML = '<img src="{{avatar}}" class="rounded" width="40" height="40">';
  var PIN_TEG = 'div';
  var PIN_CLASS = 'pin';
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var PIN_MAIN_WIDTH = 75;
  var PIN_MAIN_HEIGHT = 94;
  var PIN_ACTIVE_CLASS = 'pin--active';

  var avatarToIndex = {};
  var activePin = null;

  var setPinToIndex = function (avatar, index) {
    avatarToIndex[avatar] = index;
  };

  // вычислить позицию метки на карте с учетом размера метки
  var calcPinMapPosition = function (location, isMainPin) {
    var offsetX = isMainPin ? Math.floor(PIN_MAIN_WIDTH / 2) : Math.floor(PIN_WIDTH / 2);
    var offsetY = isMainPin ? PIN_MAIN_HEIGHT : PIN_HEIGHT;
    var position = {};
    position.x = location.x - offsetX;
    position.y = location.y - offsetY;
    return position;
  };

  var renderPin = function (offerItem) {
    var element = document.createElement(PIN_TEG);
    var positionPin = calcPinMapPosition(offerItem.location);
    element.className = PIN_CLASS;
    element.style.left = positionPin.x + 'px';
    element.style.top = positionPin.y + 'px';
    element.innerHTML = PIN_INNER_HTML.replace('{{avatar}}', offerItem.author.avatar);
    element.tabIndex = 0;
    return element;
  };

  window.pin = {
    // вычислить координаты адреса, на который указывает метка (с учетом ее размера)
    calcPinLocation: function (position, isMainPin) {
      var offsetX = isMainPin ? Math.floor(PIN_MAIN_WIDTH / 2) : Math.floor(PIN_WIDTH / 2);
      var offsetY = isMainPin ? PIN_MAIN_HEIGHT : PIN_HEIGHT;
      var location = {};
      location.x = position.x + offsetX;
      location.y = position.y + offsetY;
      return location;
    },

    // получить индекс объявления, которое соответствует заданной pin (метке)
    getPinIndex: function (pin) {
      // получить путь к файлу аватара метки
      var avatar = pin.querySelector('img').attributes.src.textContent;
      return avatarToIndex[avatar];
    },

    renderPinList: function (offers) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < offers.length; i++) {
        fragment.appendChild(renderPin(offers[i]));
        setPinToIndex(offers[i].author.avatar, i);
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
