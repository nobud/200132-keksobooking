'use strict';

// объект список объявлений
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

  // создать объявление с заданными параметрами
  createPin: function (avatar, title, address, price, type, rooms, guests, checkin, checkout, features) {
    // Объявление
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

  // сгенерировать и получить массив объявлений
  getValues: function () {
    for (var i = 0; i < this.length; i++) {
      this.values[i] = this.createPin(this.getAvatar(), this.getTitle(), this.getAddress(),
          this.getPrice(), this.getType(), this.getRooms(), this.getGuests(),
          this.getCheckIn(), this.getCheckOut(), this.getFeatures());
    }
    return this.values;
  }
};
