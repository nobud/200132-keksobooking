// работа с формой объявления
'use strict';

(function () {
  var noticeFormElement = document.querySelector('.notice__form');
  var noticeTimeinElement = noticeFormElement.querySelector('#timein');
  var noticeTimeoutElement = noticeFormElement.querySelector('#timeout');
  var noticeTypeHouseElement = noticeFormElement.querySelector('#type');
  var noticePriceElement = noticeFormElement.querySelector('#price');
  var noticeRoomNumberElement = noticeFormElement.querySelector('#room_number');
  var noticeCapacityElement = noticeFormElement.querySelector('#capacity');

  // соответствие минимальной цены типу жилья
  var noticeTypeHouseToMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // соответствие количества комнат возможным вариантам Capacity
  var noticeRoomNumberToCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  // обработчик изменения времени заезда (синхронизация со временем выезда)
  var onNoticeTimeInOrOutChange = function (evt) {
    if (evt.target === noticeTimeinElement) {
      noticeTimeoutElement.value = evt.target.value;
    } else {
      noticeTimeinElement.value = evt.target.value;
    }
  };

  // синхронизация типа жилья с минимальной ценой
  var setMinPriceforTypeHouse = function (typeHouse) {
    var minPrice = noticeTypeHouseToMinPrice[typeHouse];
    noticePriceElement.min = minPrice;
    noticePriceElement.value = minPrice;
  };

  // обработчик изменения типа жилья (синхронизация с минимальной ценой)
  var onNoticeTypeHouseChange = function (evt) {
    setMinPriceforTypeHouse(evt.target.value);
  };

  // установить количество гостей по умолчанию для заданного количества комнат
  var setDefaultCapacityForRoomsCount = function (roomsCountValue) {
    if (noticeRoomNumberToCapacity[roomsCountValue].length) {
      noticeCapacityElement.value = noticeRoomNumberToCapacity[roomsCountValue][noticeRoomNumberToCapacity[roomsCountValue].length - 1];
    }
  };

  // установить список возможных вариантов количества гостей для заданного количества комнат
  var setItemsCapacityForRoomsCount = function (roomsCountValue) {
    for (var i = 0; i < noticeCapacityElement.options.length; i++) {
      noticeCapacityElement.options[i].style.display = noticeRoomNumberToCapacity[roomsCountValue].includes(noticeCapacityElement.options[i].value) ?
        'block' : 'none';
    }
    setDefaultCapacityForRoomsCount(roomsCountValue);
  };

  // обработчик изменения количества комнат
  var onNoticeRoomNumberChange = function (evt) {
    setItemsCapacityForRoomsCount(evt.target.value);
  };

  // обработка события не валидности элемента формы Notice
  var onNoticeElementInvalid = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.classList.add('invalid');
    }
  };

  // обработка события change элемента формы Notice
  // при валидности элемента сбрасывать соответствующий класс
  var onNoticeElementChange = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.classList.add('invalid');
    } else {
      evt.target.classList.remove('invalid');
    }
  };

  var onNoticeFormShow = function () {
    // установить синхронизации полей формы
    setItemsCapacityForRoomsCount(noticeRoomNumberElement.value);
    setMinPriceforTypeHouse(noticeTypeHouseElement.value);
  };

  // добавить обработчики элементов формы запроса
  var addNoticeFormHandlers = function () {
    noticeTimeinElement.addEventListener('change', onNoticeTimeInOrOutChange);
    noticeTimeoutElement.addEventListener('change', onNoticeTimeInOrOutChange);
    noticeTypeHouseElement.addEventListener('change', onNoticeTypeHouseChange);
    noticeRoomNumberElement.addEventListener('change', onNoticeRoomNumberChange);
    noticeFormElement.addEventListener('invalid', onNoticeElementInvalid, true);
    noticeFormElement.addEventListener('change', onNoticeElementChange);
  };

  var onNoticeFormLoad = function () {
    addNoticeFormHandlers();
  };

  window.addEventListener('pageshow', onNoticeFormShow);

  window.addEventListener('load', onNoticeFormLoad);
})();
