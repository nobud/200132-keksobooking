'use strict';

(function () {
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    checkMin: function (value, min) {
      return value > min;
    },

    checkMax: function (value, max) {
      return value < max;
    },

    checkRange: function (value, min, max) {
      return value >= min && value <= max;
    },

    includeList: function (list, filterList) {
      return filterList.every(function (filter) {
        return list.indexOf(filter) >= 0;
      });
    },

    isEnterPressed: function (evt) {
      return evt.keyCode === keyCode.ENTER;
    },

    isEscPressed: function (evt) {
      return evt.keyCode === keyCode.ESC;
    }
  };
})();
