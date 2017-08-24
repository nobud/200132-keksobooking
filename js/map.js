'use strict';

// объект - список объявлений
var pinList = {
  length: 8,

  // массив объявлений
  values: [],

  // словарь правил и возможных значений объявлений
  dictionaryOffers: {
    avatarList: {
      pathTemplate: 'img/avatars/user{{xx}}.png',
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
  createPin: function (avatar, title, address, price, type, rooms, guests, checkin, checkout, features) {
    // Объявление - элемент массива
    var pin = {
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
    return pin;
  },

  // получить массив объявлений
  getValues: function () {
    for (var i = 0; i < this.length; i++) {
      this.values[i] = this.createPin(this.getAvatar(), this.getTitle(), this.getAddress(),
          this.getPrice(), this.getType(), this.getRooms(), this.getGuests(),
          this.getCheckIn(), this.getCheckOut(), this.getFeatures());
    }
    return this.values;
  },
};

// метка на карте как элемент dom-дерева
var pinElement = {
  PIN_INNER_HTML: '<img src="{{avatar}}" class="rounded" width="40" height="40">',
  PIN_TEG: 'div',
  PIN_CLASS: 'pin',
  PIN_WIDTH: 56,
  PIN_HEIGHT: 75,

  renderPin: function (x, y, avatar) {
    var element = document.createElement(this.PIN_TEG);
    var deltaX = Math.floor(this.PIN_WIDTH / 2);
    var deltaY = this.PIN_HEIGHT;
    element.className = this.PIN_CLASS;
    element.style.left = (x + deltaX) + 'px';
    element.style.top = (y + deltaY) + 'px';
    element.innerHTML = this.PIN_INNER_HTML.replace('{{avatar}}', avatar);
    return element;
  },

  renderPinList: function (pins) {
    var fragment = document.createDocumentFragment();
    var mapElement = document.querySelector('.tokyo__pin-map');
    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(this.renderPin(pins[i].location.x, pins[i].location.y,
          pins[i].author.avatar));
    }
    mapElement.appendChild(fragment);
  }
};

var offerElement = {
  FEATURE_TEG: 'span',
  FEATURE_CLASS_TEMPL: 'feature__image feature__image--',

  typeHouse: {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  },

  renderFeature: function (feature) {
    var element = document.createElement(this.FEATURE_TEG);
    element.className = this.FEATURE_CLASS_TEMPL + feature;
    return element;
  },

  renderFeatureList: function (features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      fragment.appendChild(this.renderFeature(features[i]));
    }
    return fragment;
  },

  renderOffer: function (title, address, price, type, countRooms, countGuests,
      checkin, checkout, features, description, avatar) {
    var dialogElement = document.querySelector('.dialog');
    var dialogPanelElement = document.querySelector('.dialog__panel');
    var offerTemplate = document.querySelector('#lodge-template').content;
    var element = offerTemplate.cloneNode(true);
    element.querySelector('.lodge__title').textContent = title;
    element.querySelector('.lodge__address').textContent = address;
    element.querySelector('.lodge__price').textContent = price + '\u20bd/ночь';
    element.querySelector('.lodge__type').textContent = this.typeHouse[type];
    element.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' +
        countGuests + ' гостей в ' + countRooms + ' комнатах';
    element.querySelector('.lodge__checkin-time').textContent = 'Заезд после {{checkin}}, выезд до           {{checkout}}'.replace('{{checkin}}', checkin).replace('{{checkout}}', checkout);
    element.querySelector('.lodge__features').appendChild(this.renderFeatureList(features));
    element.querySelector('.lodge__description').textContent = description;

    dialogElement.appendChild(element);
    dialogElement.removeChild(dialogPanelElement);

    dialogElement.querySelector('.dialog__title > img').src = avatar;
    return element;
  }
};

var pins = pinList.getValues();
pinElement.renderPinList(pins);
offerElement.renderOffer(pins[0].offer.title, pins[0].offer.address, pins[0].offer.price,
    pins[0].offer.type, pins[0].offer.rooms, pins[0].offer.guests, pins[0].offer.checkin, pins[0].offer.checkout,
    pins[0].offer.features, pins[0].offer.description, pins[0].author.avatar);
