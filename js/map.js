'use strict';

var OFFER_LIST_LENGHT = 8;
var PIN_INNER_HTML = '<img src="{{avatar}}" class="rounded" width="40" height="40">';
var PIN_TEG = 'div';
var PIN_CLASS = 'pin';
var PIN_ACTIVE_CLASS = 'pin--active';
var PIN_WIDTH = 56;
var PIN_HEIGHT = 75;
var FEATURE_TEG = 'span';
var FEATURE_CLASS_TEMPL = 'feature__image feature__image--';
var AVATAR_PATH_TEMPL = 'img/avatars/user{{xx}}.png';

var activePin = null;
var mapElement = document.querySelector('.tokyo__pin-map');
var dialogElement = document.querySelector('.dialog');
var dialogTitleElement = dialogElement.querySelector('.dialog__title');
var dialogCloseElement = dialogTitleElement.querySelector('.dialog__close');

var noticeFormElement = document.querySelector('.notice__form');
var noticeTimeinElement = noticeFormElement.querySelector('#timein');
var noticeTimeoutElement = noticeFormElement.querySelector('#timeout');
var noticeTypeHouseElement = noticeFormElement.querySelector('#type');
var noticePriceElement = noticeFormElement.querySelector('#price');
var noticeRoomNumberElement = noticeFormElement.querySelector('#room_number');
var noticeCapacityElement = noticeFormElement.querySelector('#capacity');


var keyCode = {
  ESC: 27,
  ENTER: 13
};

window.keyboard = {
  isEnterPressed: function (evt) {
    return evt.keyCode === keyCode.ENTER;
  },
  isEscPressed: function (evt) {
    return evt.keyCode === keyCode.ESC;
  },
  isTabPressed: function (evt) {
    return evt.keyCode === keyCode.TAB;
  }
};

// соответствие минимальной цене типу жилья
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

// объект - список объявлений
var offerList = {
  length: OFFER_LIST_LENGHT,

  // массив объявлений
  values: [],

  // словарь правил и возможных значений объявлений
  dictionaryOffers: {
    avatarList: {
      pathTemplate: AVATAR_PATH_TEMPL,
      isUsed: []
    },

    titleList: {
      values: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
      isUsed: []
    },

    addressList: {
      values: [],
      isUsed: []
    },

    price: {
      min: 1000,
      max: 1000000
    },

    typeList: {
      values: ['flat', 'house', 'bungalo']
    },

    rooms: {
      min: 1,
      max: 5
    },

    guests: {
      min: 1,
      max: 10
    },

    checkin: {
      values: ['12:00', '13:00', '14:00']
    },

    checkout: {
      values: ['12:00', '13:00', '14:00']
    },

    features: {
      values: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
    },

    location: {
      minX: 300,
      maxX: 900,
      minY: 100,
      maxY: 500
    }
  },

  // генерирование значений
  getRandomValue: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getAvatar: function () {
    var avatarNumber;
    do {
      avatarNumber = this.getRandomValue(1, this.length);
    } while (this.dictionaryOffers.avatarList.isUsed[avatarNumber - 1]);

    this.dictionaryOffers.avatarList.isUsed[avatarNumber - 1] = true;
    return this.dictionaryOffers.avatarList.pathTemplate.replace('{{xx}}', '0' + avatarNumber);
  },

  getTitle: function () {
    var titleIndex;
    do {
      titleIndex = this.getRandomValue(0, this.dictionaryOffers.titleList.values.length - 1);
    } while (this.dictionaryOffers.titleList.isUsed[titleIndex]);

    this.dictionaryOffers.titleList.isUsed[titleIndex] = true;
    return this.dictionaryOffers.titleList.values[titleIndex];
  },

  getPrice: function () {
    return this.getRandomValue(this.dictionaryOffers.price.min, this.dictionaryOffers.price.max);
  },

  getType: function () {
    return this.dictionaryOffers.typeList.values[this.getRandomValue(0, this.dictionaryOffers.typeList.values.length - 1)];
  },

  getRooms: function () {
    return this.getRandomValue(this.dictionaryOffers.rooms.min, this.dictionaryOffers.rooms.max);
  },

  getGuests: function () {
    return this.getRandomValue(this.dictionaryOffers.guests.min, this.dictionaryOffers.guests.max);
  },

  getCheckIn: function () {
    return this.dictionaryOffers.checkin.values[this.getRandomValue(0, this.dictionaryOffers.checkin.values.length - 1)];
  },

  getCheckOut: function () {
    return this.dictionaryOffers.checkout.values[this.getRandomValue(0, this.dictionaryOffers.checkout.values.length - 1)];
  },

  getFeatures: function () {
    var countFeatures = this.getRandomValue(1, this.dictionaryOffers.features.values.length);
    var features = [];
    for (var i = 0; i < countFeatures; i++) {
      features[i] = this.dictionaryOffers.features.values[i];
    }
    return features;
  },

  getLocation: function () {
    var location = {};
    location.x = this.getRandomValue(this.dictionaryOffers.location.minX, this.dictionaryOffers.location.maxX);
    location.y = this.getRandomValue(this.dictionaryOffers.location.minY, this.dictionaryOffers.location.maxY);
    return location;
  },

  getAddress: function () {
    var address = {};
    var location = this.getLocation();
    address.x = location.x;
    address.y = location.y;
    address.text = location.x + ', ' + location.y;
    return address;
  },

  // создать элемент массива - объявление с заданными параметрами
  createOfferItem: function (avatar, title, address, price, type, rooms, guests, checkin, checkout, features) {
    // Объявление - элемент массива
    var offerItem = {
      author: {
        avatar: avatar
      },
      offer: {
        title: title,
        address: address.text,
        price: price,
        type: type,
        rooms: rooms,
        guests: guests,
        checkin: checkin,
        checkout: checkout,
        features: features,
        description: '',
        photos: []
      },
      location: {
        x: address.x,
        y: address.y
      }
    };
    return offerItem;
  },

  // получить массив объявлений
  getValues: function () {
    for (var i = 0; i < this.length; i++) {
      this.values[i] = this.createOfferItem(this.getAvatar(), this.getTitle(), this.getAddress(),
          this.getPrice(), this.getType(), this.getRooms(), this.getGuests(),
          this.getCheckIn(), this.getCheckOut(), this.getFeatures());
    }
    return this.values;
  },
};

// метка на карте как элемент DOM-дерева
var pinObject = {
  avatarToIndexLink: {},

  setPinToIndexLink: function (avatar, index) {
    this.avatarToIndexLink[avatar] = index;
  },

  getIndexOfPin: function (avatar) {
    return this.avatarToIndexLink[avatar];
  },

  renderPin: function (offerItem) {
    var element = document.createElement(PIN_TEG);
    var deltaX = Math.floor(PIN_WIDTH / 2);
    var deltaY = PIN_HEIGHT;
    element.className = PIN_CLASS;
    element.style.left = (offerItem.location.x + deltaX) + 'px';
    element.style.top = (offerItem.location.y + deltaY) + 'px';
    element.innerHTML = PIN_INNER_HTML.replace('{{avatar}}', offerItem.author.avatar);
    element.tabIndex = 0;
    return element;
  },

  renderPinList: function (offers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(this.renderPin(offers[i]));
      this.setPinToIndexLink(offers[i].author.avatar, i);
    }
    mapElement.appendChild(fragment);
  }
};

// объявление как элемент DOM-дерева
var offerObject = {
  typeHouse: {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },

  renderFeature: function (feature) {
    var element = document.createElement(FEATURE_TEG);
    element.className = FEATURE_CLASS_TEMPL + feature;
    return element;
  },

  renderFeatureList: function (features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      fragment.appendChild(this.renderFeature(features[i]));
    }
    return fragment;
  },

  createOfferElement: function (offerItem) {
    var offerTemplate = document.querySelector('#lodge-template').content;
    var element = offerTemplate.cloneNode(true);
    element.querySelector('.lodge__title').textContent = offerItem.offer.title;
    element.querySelector('.lodge__address').textContent = offerItem.offer.address;
    element.querySelector('.lodge__price').textContent = offerItem.offer.price + '\u20bd/ночь';
    element.querySelector('.lodge__type').textContent = this.typeHouse[offerItem.offer.type];
    element.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' +
        offerItem.offer.guests + ' гостей в ' + offerItem.offer.rooms + ' комнатах';
    element.querySelector('.lodge__checkin-time').textContent = 'Заезд после {{checkin}}, выезд до           {{checkout}}'.replace('{{checkin}}', offerItem.offer.checkin).replace('{{checkout}}', offerItem.offer.checkout);
    element.querySelector('.lodge__features').appendChild(this.renderFeatureList(offerItem.offer.features));
    element.querySelector('.lodge__description').textContent = offerItem.offer.description;
    return element;
  },

  changeDialogPanel: function (newDialogPanelElement) {
    var dialogPanelElement = document.querySelector('.dialog__panel');
    dialogElement.replaceChild(newDialogPanelElement, dialogPanelElement);
  },

  renderOffer: function (offerItem) {
    dialogTitleElement.querySelector('img').src = offerItem.author.avatar;
    this.changeDialogPanel(this.createOfferElement(offerItem));
  }
};

// сбросить ранее активную метку
var resetActivePin = function () {
  // снять выделение с ранее активной метки
  if (activePin) {
    activePin.classList.remove(PIN_ACTIVE_CLASS);
    activePin = null;
  }
};

// изменить активную метку
var changeActivePin = function (pin) {
  // сбросить ранее активную метку
  resetActivePin();
  // сделать активной метку pin
  activePin = pin;
  activePin.classList.add(PIN_ACTIVE_CLASS);
};

// изменить активное объявление
var changeActiveOffer = function (pin) {
  // получить путь к файлу аватара
  var avatar = pin.querySelector('img').attributes.src.textContent;
  // узнать индекс объявления и отобразить данные выбранного объявления в диалоговом окне
  offerObject.renderOffer(offers[pinObject.getIndexOfPin(avatar)]);
};

// открыть окно с активным объявлением
var openActiveOffer = function (pin) {
  // установить новую активную метку
  changeActivePin(pin);
  // отобразить данные объявления, соответствующие активной метке
  changeActiveOffer(pin);
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
  var lastFocusedPin = activePin;
  // сбросить активную метку
  resetActivePin();
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
  if (window.keyboard.isEnterPressed(evt)) {
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
  if (window.keyboard.isEnterPressed(evt)) {
    closeActiveOffer();
  }
};

// обработчик нажатия ESC при открытом диалоговом окне (закрыть диалоговое окно)
var onDialogEscPress = function (evt) {
  if (window.keyboard.isEscPressed(evt)) {
    closeActiveOffer();
  }
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

var onNoticeElementInvalid = function (evt) {
  if (!evt.target.validity.valid) {
    evt.target.classList.add('invalid');
  }
};

var onNoticeElementChange = function (evt) {
  if (!evt.target.validity.valid) {
    evt.target.classList.add('invalid');
  } else {
    evt.target.classList.remove('invalid');
  }
};

// сгенерировать и получить массив с объявлениями
var offers = offerList.getValues();
// отрисовать метки
pinObject.renderPinList(offers);
// добавить обработчики для меток на карте
mapElement.addEventListener('click', onPinClick);
mapElement.addEventListener('keydown', onPinEnterPress);
// добавить обработчики элементов формы запроса
noticeTimeinElement.addEventListener('change', onNoticeTimeInOrOutChange);
noticeTimeoutElement.addEventListener('change', onNoticeTimeInOrOutChange);
noticeTypeHouseElement.addEventListener('change', onNoticeTypeHouseChange);
noticeRoomNumberElement.addEventListener('change', onNoticeRoomNumberChange);
noticeFormElement.addEventListener('invalid', onNoticeElementInvalid, true);
noticeFormElement.addEventListener('change', onNoticeElementChange);

setItemsCapacityForRoomsCount(noticeRoomNumberElement.value);
setMinPriceforTypeHouse(noticeTypeHouseElement.value);
