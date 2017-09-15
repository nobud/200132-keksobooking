'use strict';

(function () {
  var pinMain = document.querySelector('.pin__main');
  var pinMainInitPosition = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };
  pinMain.style.zIndex = '100';
  var mapWidth = window.map.getMapWidth();
  var mapHeight = window.map.getMapHeight();
  // возможные границы адреса
  var minLocation = {
    x: 0,
    y: 200
  };
  var maxLocation = {
    x: mapWidth,
    y: mapHeight - 50
  };
  // вычислить возможные границы перемещения метки
  var minPosition = window.pin.calcPinMapPosition(minLocation, pinMain.clientWidth, pinMain.clientHeight);
  var maxPosition = window.pin.calcPinMapPosition(maxLocation, pinMain.clientWidth, pinMain.clientHeight);

  // начальные координаты метки
  var startCoords = {
    x: -1,
    y: -1
  };

  var movingElement = null;
  var onMouseDown = function (evt) {
    evt.preventDefault();

    if (evt.target === pinMain) {
      movingElement = evt.target;
    } else if (evt.target.parentElement === pinMain) {
      movingElement = evt.target.parentElement;
    }
    // запомнить начальные координаты
    startCoords.x = evt.clientX;
    startCoords.y = evt.clientY;
    // добавить обработчики перемещения мыши и отпускания кнопки мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  pinMain.addEventListener('mousedown', onMouseDown);

  var setLimitValue = function (value, min, max) {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    return value;
  };

  var onMouseMove = function (evt) {
    evt.preventDefault();
    // вычислить смещение от начальных координат
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };
    // запомнить новые начальные координаты
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // вычислить новые координаты метки
    var newPosition = {
      x: movingElement.offsetLeft - shift.x,
      y: movingElement.offsetTop - shift.y
    };

    newPosition.x = setLimitValue(newPosition.x, minPosition.x, maxPosition.x);
    newPosition.y = setLimitValue(newPosition.y, minPosition.y, maxPosition.y);

    // отобразить метку по новым координатам
    movingElement.style.top = newPosition.y + 'px';
    movingElement.style.left = newPosition.x + 'px';
    // отобразить адрес, на который указывает метка
    window.form.setNewAddress(window.pin.calcPinLocation(newPosition, movingElement.clientWidth, movingElement.clientHeight));
  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    // прекратить слушать события mousemove и mouseup
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  window.movePin = {
    getPinMainLocation: function () {
      return window.pin.calcPinLocation({x: pinMain.offsetLeft, y: pinMain.offsetTop}, pinMain.clientWidth, pinMain.clientHeight);
    },

    setDefaultPositionMainPin: function () {
      pinMain.style.left = pinMainInitPosition.x + 'px';
      pinMain.style.top = pinMainInitPosition.y + 'px';
    }
  };
})();
