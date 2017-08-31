// метка на карте
'use strict';

(function () {
  var PIN_INNER_HTML = '<img src="{{avatar}}" class="rounded" width="40" height="40">';
  var PIN_TEG = 'div';
  var PIN_CLASS = 'pin';
  var PIN_WIDTH = 56;
  var PIN_HEIGHT = 75;
  var PIN_ACTIVE_CLASS = 'pin--active';

  var avatarToIndex = {};
  var activePin = null;

  var setPinToIndex = function (avatar, index) {
    avatarToIndex[avatar] = index;
  };

  var renderPin = function (offerItem) {
    var element = document.createElement(PIN_TEG);
    var deltaX = Math.floor(PIN_WIDTH / 2);
    var deltaY = PIN_HEIGHT;
    element.className = PIN_CLASS;
    element.style.left = (offerItem.location.x + deltaX) + 'px';
    element.style.top = (offerItem.location.y + deltaY) + 'px';
    element.innerHTML = PIN_INNER_HTML.replace('{{avatar}}', offerItem.author.avatar);
    element.tabIndex = 0;
    return element;
  };

  window.pin = {
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
