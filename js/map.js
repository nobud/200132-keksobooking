'use strict';

(function () {
  var mapElement = document.querySelector('.tokyo__pin-map');
  var dialogElement = document.querySelector('.dialog');
  var dialogCloseElement = dialogElement.querySelector('.dialog__close');
  // данные объявлений
  var dataOffers = [];

  // изменить активное объявление
  var changeActiveOffer = function (newPin) {
    // узнать индекс объявления и отобразить данные выбранного объявления в диалоговом окне
    window.card.renderOffer(dataOffers[window.pin.getPinIndex(newPin)], dialogElement);
  };

  // открыть окно с активным объявлением
  var openActiveOffer = function (newPin) {
    // установить новую активную метку
    window.pin.changeActivePin(newPin);
    // отобразить данные объявления, соответствующие активной метке
    changeActiveOffer(newPin);
    // добавить обработчики
    dialogCloseElement.addEventListener('click', onDialogCloseClick);
    dialogCloseElement.addEventListener('keydown', onDialogCloseEnterPress);
    document.addEventListener('keydown', onDialogEscPress);
    // показать диалоговое окно
    dialogElement.classList.remove('hidden');
    dialogElement.focus();
  };

  // закрыть окно с активным объявлением
  var closeActiveOffer = function () {
    var lastFocusedPin = window.pin.getActivePin();
    // сбросить активную метку
    window.pin.resetActivePin();
    // удалить обработчики
    dialogCloseElement.removeEventListener('click', onDialogCloseClick);
    dialogCloseElement.removeEventListener('keydown', onDialogCloseEnterPress);
    document.removeEventListener('keydown', onDialogEscPress);
    // скрыть диалоговое окно
    dialogElement.classList.add('hidden');
    if (lastFocusedPin) {
      lastFocusedPin.focus();
    }
  };

  // обработчик клика по метке
  var onPinClick = function (evt) {
    var pin = evt.target.closest('.pin');
    // если клик по метке и она не является "главной" меткой
    if (pin && !pin.classList.contains('pin__main')) {
      openActiveOffer(pin);
    }
  };

  // обработчик нажатия Enter на метке
  var onPinEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      if (evt.target.className === 'pin') {
        openActiveOffer(evt.target);
      }
    }
  };

  // обработчик клика по кнопке закрытия окна
  var onDialogCloseClick = function () {
    closeActiveOffer();
  };

  // обработчик нажатия Enter на кнопке закрытия окна
  var onDialogCloseEnterPress = function (evt) {
    if (window.util.isEnterPressed(evt)) {
      closeActiveOffer();
    }
  };

  // обработчик нажатия ESC при открытом диалоговом окне (закрыть диалоговое окно)
  var onDialogEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closeActiveOffer();
    }
  };

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

  var pinMain = mapElement.querySelector('.pin__main');
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

  var onMapLoad = function () {
    // получить данные с объявлениями
    dataOffers = window.data.getValues();
    // отрисовать метки
    mapElement.appendChild(window.pin.renderPinList(dataOffers));
    // добавить обработчики событий для меток на карте
    mapElement.addEventListener('click', onPinClick);
    mapElement.addEventListener('keydown', onPinEnterPress);
  };

  window.addEventListener('load', onMapLoad);

  window.map = {
    getPinMainLocation: function () {
      var position = {};
      position.x = pinMain.offsetLeft;
      position.y = pinMain.offsetTop;
      return window.pin.calcPinLocation(position, true);
    }
  };
})();
