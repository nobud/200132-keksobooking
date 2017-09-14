'use strict';

(function () {
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    isEnterPressed: function (evt) {
      return evt.keyCode === keyCode.ENTER;
    },

    isEscPressed: function (evt) {
      return evt.keyCode === keyCode.ESC;
    },

    // генерирование случайного значения в диапазоне [min; max]
    getRandomValue: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomUniqValues: function (min, max, count) {
      var uniqRandomValues = [];
      var value;
      while (uniqRandomValues.length < count) {
        value = this.getRandomValue(min, max);
        if (!uniqRandomValues.includes(value)) {
          uniqRandomValues.push(value);
        }
      }
      return uniqRandomValues;
    }
  };
})();
