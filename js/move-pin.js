'use strict';

(function () {
  var mapElement = document.querySelector('.tokyo__pin-map');
  var pinMain = mapElement.querySelector('.pin__main');
  // начальные координаты метки
  var startCoords = {
    x: -1,
    y: -1
  };

  var onMouseDown = function (evt) {
    evt.preventDefault();
    // запомнить начальные координаты
    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
    // добавить обработчики перемещения мыши и отпускания кнопки мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  pinMain.addEventListener('mousedown', onMouseDown);

  var onMouseMove = function (evt) {
    evt.preventDefault();
    // вычислить смещение от начальных координат
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };
    // запомнить начальные координаты
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // новые координаты метки
    var newPosition = {};
    newPosition.x = pinMain.offsetLeft - shift.x;
    newPosition.y = pinMain.offsetTop - shift.y;
    // отобразить метку по новым координатам
    pinMain.style.top = newPosition.y + 'px';
    pinMain.style.left = newPosition.x + 'px';
    // отобразить адрес, на который указывает метка
    window.form.setNewAddress(window.pin.calcPinLocation(newPosition, true));
  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    // прекратить слушать события mousemove и mouseup
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  window.movePin = {
    getPinMainLocation: function () {
      var position = {};
      position.x = pinMain.offsetLeft;
      position.y = pinMain.offsetTop;
      return window.pin.calcPinLocation(position, true);
    }
  };
})();
