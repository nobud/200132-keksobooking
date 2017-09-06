'use strict';

(function () {
  var pinMain = document.querySelector('.pin__main');
  pinMain.style.zIndex = '100';
  var mapWidth = window.map.getMapWidth();
  var mapHeight = window.map.getMapHeight();
  // возможные границы адреса
  var rangeLocation = {
    minX: 0,
    minY: 50,
    maxX: mapWidth,
    maxY: mapHeight - 200
  };
  // вычислить возможные границы перемещения метки
  var minLocation = {};
  minLocation.x = rangeLocation.minX;
  minLocation.y = rangeLocation.maxY;
  var minPosition = window.pin.calcPinMapPosition(minLocation, pinMain.clientWidth, pinMain.clientHeight, mapHeight);
  var maxLocation = {};
  maxLocation.x = rangeLocation.maxX;
  maxLocation.y = rangeLocation.minY;
  var maxPosition = window.pin.calcPinMapPosition(maxLocation, pinMain.clientWidth, pinMain.clientHeight, mapHeight);

  // начальные координаты метки
  var startCoords = {
    x: -1,
    y: -1
  };

  var movingElement = null;
  var onMouseDown = function (evt) {
    evt.preventDefault();
    movingElement = evt.target.closest('.pin__main');
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
    newPosition.x = movingElement.offsetLeft - shift.x;
    newPosition.y = movingElement.offsetTop - shift.y;
    if (newPosition.x < minPosition.x) {
      newPosition.x = minPosition.x;
    } else if (newPosition.x > maxPosition.x) {
      newPosition.x = maxPosition.x;
    }

    if (newPosition.y < minPosition.y) {
      newPosition.y = minPosition.y;
    } else if (newPosition.y > maxPosition.y) {
      newPosition.y = maxPosition.y;
    }

    // отобразить метку по новым координатам
    movingElement.style.top = newPosition.y + 'px';
    movingElement.style.left = newPosition.x + 'px';
    // отобразить адрес, на который указывает метка
    window.form.setNewAddress(window.pin.calcPinLocation(newPosition, movingElement.clientWidth, movingElement.clientHeight, mapHeight));
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
      return window.pin.calcPinLocation(position, pinMain.clientWidth, pinMain.clientHeight, mapHeight);
    }
  };
})();
