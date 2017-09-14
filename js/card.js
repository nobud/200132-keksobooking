'use strict';

(function () {
  var FEATURE_TEG = 'span';
  var FEATURE_CLASS_TEMPL = 'feature__image feature__image--';
  var CHECKIN_CHECKOUT_TEXT = 'Заезд после {{checkin}}, выезд до {{checkout}}';
  var ROOMS_AND_GUESTS_TEXT = 'Для {{guests}} гостей в {{rooms}} комнатах';
  var PRICE_TEXT = '{{price}}\u20bd/ночь';

  var typeHouse = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var renderFeature = function (feature) {
    var element = document.createElement(FEATURE_TEG);
    element.className = FEATURE_CLASS_TEMPL + feature;
    return element;
  };

  var renderFeatureList = function (features) {
    var fragment = document.createDocumentFragment();
    features.forEach(function (feature) {
      fragment.appendChild(renderFeature(feature));
    });
    return fragment;
  };

  var createOfferElement = function (offerItem) {
    var offerTemplate = document.querySelector('#lodge-template').content;
    var element = offerTemplate.cloneNode(true);
    element.querySelector('.lodge__title').textContent = offerItem.offer.title;
    element.querySelector('.lodge__address').textContent = offerItem.offer.address;
    element.querySelector('.lodge__price').textContent = PRICE_TEXT.replace('{{price}}', offerItem.offer.price);
    element.querySelector('.lodge__type').textContent = typeHouse[offerItem.offer.type];
    element.querySelector('.lodge__rooms-and-guests').textContent = ROOMS_AND_GUESTS_TEXT.replace('{{guests}}', offerItem.offer.guests).replace('{{rooms}}', offerItem.offer.rooms);
    element.querySelector('.lodge__checkin-time').textContent = CHECKIN_CHECKOUT_TEXT.replace('{{checkin}}', offerItem.offer.checkin).replace('{{checkout}}', offerItem.offer.checkout);
    element.querySelector('.lodge__features').appendChild(renderFeatureList(offerItem.offer.features));
    element.querySelector('.lodge__description').textContent = offerItem.offer.description;
    return element;
  };

  var changeDialogPanel = function (newDialogPanelElement, parent) {
    var dialogPanelElement = document.querySelector('.dialog__panel');
    parent.replaceChild(newDialogPanelElement, dialogPanelElement);
  };

  window.card = {
    renderOffer: function (offerItem, parent) {
      var dialogTitleElement = parent.querySelector('.dialog__title');
      dialogTitleElement.querySelector('img').src = offerItem.author.avatar;
      changeDialogPanel(createOfferElement(offerItem), parent);
    }
  };
})();
