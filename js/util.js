'use strict';

(function () {
  var keyCode = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    verticalAlignMessage: {
      top: 0,
      bottom: 1
    },

    isEnterPressed: function (evt) {
      return evt.keyCode === keyCode.ENTER;
    },
    isEscPressed: function (evt) {
      return evt.keyCode === keyCode.ESC;
    }
  };
})();
