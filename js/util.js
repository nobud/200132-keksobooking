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
    }
  };
})();
