'use strict';

(function () {
  var NO_FILTER = 'any';
  var priceRange = {
    low: {
      min: NO_FILTER,
      max: 9999
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50001,
      max: NO_FILTER
    },
    any: NO_FILTER
  };

  var tokyoFiltersFormElement = document.querySelector('.tokyo__filters');
  var housingTypeElement = tokyoFiltersFormElement.querySelector('#housing_type');
  var housingRoomNumberElement = tokyoFiltersFormElement.querySelector('#housing_room-number');
  var housingGuestsNumberElement = tokyoFiltersFormElement.querySelector('#housing_guests-number');
  var housingPriceElement = tokyoFiltersFormElement.querySelector('#housing_price');
  var tokyoFiltersetElement = tokyoFiltersFormElement.querySelector('#housing_features');
  var featuresListElement = tokyoFiltersetElement.elements;

  var typeHouse;
  var roomsNumber;
  var guestsNumber;
  var rangePrice;
  var features = [];

  var getFeaturesForFilter = function () {
    return Array.from(featuresListElement).filter(function (feature) {
      return feature.checked;
    }).map(function (featureChecked) {
      return featureChecked.value;
    });
  };

  var getPriceRangeForFilter = function (rangeStr) {
    return priceRange[rangeStr];
  };

  var comparePrice = function (value, filterValue) {
    if (filterValue !== NO_FILTER) {
      if (filterValue.min === NO_FILTER) {
        return window.util.checkMax(value, filterValue.max);
      }
      if (filterValue.max === NO_FILTER) {
        return window.util.checkMin(value, filterValue.min);
      }
      return window.util.checkRange(value, filterValue.min, filterValue.max);
    } else {
      return true;
    }
  };

  var compareValue = function (value, filterValue) {
    return filterValue === NO_FILTER ? true : value === filterValue;
  };

  var getFilteredOffers = function (offers) {
    return offers.filter(function (item) {
      return comparePrice(item.offer.price, rangePrice) &&
      compareValue(String(item.offer.type), typeHouse) &&
      compareValue(String(item.offer.rooms), roomsNumber) &&
      compareValue(String(item.offer.guests), guestsNumber) &&
      window.util.includeList(item.offer.features, features);
    });
  };

  var updatePins = function () {
    var filterEvent = new CustomEvent('updateFilter', {
      detail: {
        data: getFilteredOffers(window.map.getDataOffers())
      },
      bubbles: true,
      cancellable: false
    });
    window.dispatchEvent(filterEvent);
  };

  var onHousingTypeElementChange = function () {
    typeHouse = housingTypeElement.value;
    window.debounce(updatePins);
  };

  var onHousingRoomNumberElementChange = function () {
    roomsNumber = housingRoomNumberElement.value;
    window.debounce(updatePins);
  };

  var onHousingGuestsNumberElementChange = function () {
    guestsNumber = housingGuestsNumberElement.value;
    window.debounce(updatePins);
  };

  var onHousingPriceElementChange = function () {
    rangePrice = getPriceRangeForFilter(housingPriceElement.value);
    window.debounce(updatePins);
  };

  var onTokyoFiltersetElementChange = function () {
    features = getFeaturesForFilter();
    window.debounce(updatePins);
  };

  var onTokyoFiltersFormElementLoad = function () {
    initFilters();
    housingTypeElement.addEventListener('change', onHousingTypeElementChange);
    housingRoomNumberElement.addEventListener('change', onHousingRoomNumberElementChange);
    housingGuestsNumberElement.addEventListener('change', onHousingGuestsNumberElementChange);
    housingPriceElement.addEventListener('change', onHousingPriceElementChange);
    tokyoFiltersetElement.addEventListener('change', onTokyoFiltersetElementChange);
  };

  var initFilters = function () {
    typeHouse = housingTypeElement.value;
    roomsNumber = housingRoomNumberElement.value;
    guestsNumber = housingGuestsNumberElement.value;
    rangePrice = getPriceRangeForFilter(housingPriceElement.value);
    features = getFeaturesForFilter();
  };

  window.addEventListener('load', onTokyoFiltersFormElementLoad);
})();
