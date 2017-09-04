'use strict';

(function () {
  window.synchronizeFields = function (fromElement, toElement, valuesMap, callback) {
    var selectedValue = fromElement.value;
    if (selectedValue) {
      var targetValue = valuesMap[selectedValue];
      callback(toElement, targetValue);
    }
  };
})();
