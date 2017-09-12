// работа с формой объявления
'use strict';

(function () {
  var ADDRESS_TEXT = 'x: {{x}}, y: {{y}}';
  var URL_NEW_OFFER = 'https://1510.dump.academy/keksobooking';
  var noticeElement = document.querySelector('.notice');
  var noticeFormElement = noticeElement.querySelector('.notice__form');
  var noticeTimeinElement = noticeFormElement.querySelector('#timein');
  var noticeTimeoutElement = noticeFormElement.querySelector('#timeout');
  var noticeTypeHouseElement = noticeFormElement.querySelector('#type');
  var noticePriceElement = noticeFormElement.querySelector('#price');
  var noticeRoomNumberElement = noticeFormElement.querySelector('#room_number');
  var noticeCapacityElement = noticeFormElement.querySelector('#capacity');
  var noticeAddressElement = noticeFormElement.querySelector('#address');
  var messageElement = null;

  // соответствие типа жилья и минимальной цены
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

  // соответствие checkin значению checkout
  var noticeCheckinToCheckout = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  // соответствие checkout значению checkin
  var noticeCheckoutToCheckin = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var syncValueAndMinValue = function (element, value) {
    element.min = value;
    element.value = value;
  };

  var syncValueAndValue = function (element, value) {
    element.value = value;
  };

  var syncValueAndValueList = function (element, values) {
    for (var i = 0; i < element.options.length; i++) {
      element.options[i].style.display = values.includes(element.options[i].value) ? 'block' : 'none';
    }
    if (values.length) {
      element.value = values[values.length - 1];
    }
  };

  // обработчик изменения времени заезда (синхронизация со временем выезда)
  var onNoticeTimeInChange = function (evt) {
    window.synchronizeFields(evt.target, noticeTimeoutElement, noticeCheckinToCheckout, syncValueAndValue);
  };

  // обработчик изменения времени выезда (синхронизация со временем заезда)
  var onNoticeTimeOutChange = function (evt) {
    window.synchronizeFields(evt.target, noticeTimeinElement, noticeCheckoutToCheckin, syncValueAndValue);
  };

  // обработчик изменения типа жилья (синхронизация с минимальной ценой)
  var onNoticeTypeHouseChange = function (evt) {
    window.synchronizeFields(evt.target, noticePriceElement, noticeTypeHouseToMinPrice, syncValueAndMinValue);
  };

  // обработчик изменения количества комнат
  var onNoticeRoomNumberChange = function (evt) {
    window.synchronizeFields(evt.target, noticeCapacityElement, noticeRoomNumberToCapacity, syncValueAndValueList);
  };

  // обработка события невалидности элемента формы Notice
  var onNoticeElementInvalid = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.classList.add('invalid');
    }
  };

  var hideMessage = function () {
    if (messageElement && !messageElement.classList.contains('hidden')) {
      messageElement.classList.add('hidden');
    }
  };

  // обработка события change элемента формы Notice
  var onNoticeElementChange = function (evt) {
    if (!evt.target.validity.valid) {
      evt.target.classList.add('invalid');
    } else {
      evt.target.classList.remove('invalid');
    }
  };

  var onSuccessSubmit = function () {
    noticeFormElement.reset();
    window.movePin.setDefaultPositionMainPin();
    synchronizeNoticeForm();
    messageElement = window.message.showNotice('Данные успешно отправлены', noticeElement, window.message.verticalAlignMessage.bottom);
    setTimeout(hideMessage, 3000);
  };

  var onErrorSubmit = function (errorMessage) {
    messageElement = window.message.showError(errorMessage, noticeElement, window.message.verticalAlignMessage.bottom);
    setTimeout(hideMessage, 3000);
  };

  var onNoticeFormSubmit = function (evt) {
    hideMessage();
    window.backend.save(new FormData(noticeFormElement), onSuccessSubmit, onErrorSubmit, URL_NEW_OFFER);
    evt.preventDefault();
  };

  var synchronizeNoticeForm = function () {
    // установить синхронизации полей формы
    window.synchronizeFields(noticeRoomNumberElement, noticeCapacityElement, noticeRoomNumberToCapacity, syncValueAndValueList);
    window.synchronizeFields(noticeTypeHouseElement, noticePriceElement, noticeTypeHouseToMinPrice, syncValueAndMinValue);
    window.synchronizeFields(noticeTimeinElement, noticeTimeoutElement, noticeCheckinToCheckout, syncValueAndValue);
    // отобразить адрес, на который указывает метка адреса (pinMain на карте)
    window.form.setNewAddress(window.movePin.getPinMainLocation());
  };

  // добавить обработчики элементов формы запроса
  var addNoticeFormHandlers = function () {
    noticeTimeinElement.addEventListener('change', onNoticeTimeInChange);
    noticeTimeoutElement.addEventListener('change', onNoticeTimeOutChange);
    noticeTypeHouseElement.addEventListener('change', onNoticeTypeHouseChange);
    noticeRoomNumberElement.addEventListener('change', onNoticeRoomNumberChange);
    noticeFormElement.addEventListener('invalid', onNoticeElementInvalid, true);
    noticeFormElement.addEventListener('change', onNoticeElementChange);
    noticeFormElement.addEventListener('submit', onNoticeFormSubmit);
  };

  var onNoticeFormLoad = function () {
    addNoticeFormHandlers();
    synchronizeNoticeForm();
  };

  window.addEventListener('load', onNoticeFormLoad);

  window.form = {
    setNewAddress: function (location) {
      noticeAddressElement.value = ADDRESS_TEXT.replace('{{x}}', location.x).replace('{{y}}', location.y);
    }
  };
})();
