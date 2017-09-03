'use strict';

(function () {
  window.synchronizeFileds = function (fieldMain, fieldRel, valueFieldMain, valueFieldRel, callback) {
    var selectedValue = fieldMain.value;
    var indexOfSelectedValue = valueFieldMain.find(selectedValue);
    var targetValue = valueFieldRel[indexOfSelectedValue];
    callback(fieldRel, targetValue);
  };
})();
