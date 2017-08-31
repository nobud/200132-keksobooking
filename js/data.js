// получить список сгенерированных объявлений
'use strict';

(function () {
  var OFFER_LIST_LENGHT = 8;
  var AVATAR_PATH_TEMPL = 'img/avatars/user{{xx}}.png';

  // массив объявлений
  var values = [];

  // словарь правил и возможных значений объявлений
  var dictionaryOffers = {
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
  };

  // генерирование значений
  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getAvatar = function () {
    var avatarNumber;
    do {
      avatarNumber = getRandomValue(1, OFFER_LIST_LENGHT);
    } while (dictionaryOffers.avatarList.isUsed[avatarNumber - 1]);

    dictionaryOffers.avatarList.isUsed[avatarNumber - 1] = true;
    return dictionaryOffers.avatarList.pathTemplate.replace('{{xx}}', '0' + avatarNumber);
  };

  var getTitle = function () {
    var titleIndex;
    do {
      titleIndex = getRandomValue(0, dictionaryOffers.titleList.values.length - 1);
    } while (dictionaryOffers.titleList.isUsed[titleIndex]);

    dictionaryOffers.titleList.isUsed[titleIndex] = true;
    return dictionaryOffers.titleList.values[titleIndex];
  };

  var getPrice = function () {
    return getRandomValue(dictionaryOffers.price.min, dictionaryOffers.price.max);
  };

  var getType = function () {
    return dictionaryOffers.typeList.values[getRandomValue(0, dictionaryOffers.typeList.values.length - 1)];
  };

  var getRooms = function () {
    return getRandomValue(dictionaryOffers.rooms.min, dictionaryOffers.rooms.max);
  };

  var getGuests = function () {
    return getRandomValue(dictionaryOffers.guests.min, dictionaryOffers.guests.max);
  };

  var getCheckIn = function () {
    return dictionaryOffers.checkin.values[getRandomValue(0, dictionaryOffers.checkin.values.length - 1)];
  };

  var getCheckOut = function () {
    return dictionaryOffers.checkout.values[getRandomValue(0, dictionaryOffers.checkout.values.length - 1)];
  };

  var getFeatures = function () {
    var countFeatures = getRandomValue(1, dictionaryOffers.features.values.length);
    var features = [];
    for (var i = 0; i < countFeatures; i++) {
      features[i] = dictionaryOffers.features.values[i];
    }
    return features;
  };

  var getLocation = function () {
    var location = {};
    location.x = getRandomValue(dictionaryOffers.location.minX, dictionaryOffers.location.maxX);
    location.y = getRandomValue(dictionaryOffers.location.minY, dictionaryOffers.location.maxY);
    return location;
  };

  var getAddress = function () {
    var address = {};
    var location = getLocation();
    address.x = location.x;
    address.y = location.y;
    address.text = location.x + ', ' + location.y;
    return address;
  };

  // создать элемент массива объявлений - объявление с заданными параметрами
  var createOfferItem = function (avatar, title, address, price, type, rooms, guests, checkin, checkout, features) {
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
  };

  // сгенерировать массив объявлений
  var generateValues = function () {
    for (var i = 0; i < OFFER_LIST_LENGHT; i++) {
      values[i] = createOfferItem(getAvatar(), getTitle(), getAddress(),
          getPrice(), getType(), getRooms(), getGuests(),
          getCheckIn(), getCheckOut(), getFeatures());
    }
  };

  // получить массив объявлений
  window.data = {
    getValues: function () {
      generateValues();
      return values;
    }
  };
})();
