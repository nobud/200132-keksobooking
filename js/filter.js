'use strict';

(function () {
  var NO_FILTER = 'any';
  var FILTER_HOUSE_TYPE = 'type';
  var FILTER_PRICE = 'price';
  var FILTER_ROOMS_NUMBER = 'roomsNumber';
  var FILTER_GUESTS_NUMBER = 'guestsNumber';
  var FILTER_FEATURES = 'feature';

  var priceRange = {
    low: {
      min: NO_FILTER,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: NO_FILTER
    },
    any: NO_FILTER
  };

  var filterSet = {};
  var tokyoFiltersFormElement = document.querySelector('.tokyo__filters');
  var housingTypeElement = tokyoFiltersFormElement.querySelector('#housing_type');
  var housingRoomNumberElement = tokyoFiltersFormElement.querySelector('#housing_room-number');
  var housingGuestsNumberElement = tokyoFiltersFormElement.querySelector('#housing_guests-number');
  var housingPriceElement = tokyoFiltersFormElement.querySelector('#housing_price');
  var tokyoFiltersetElement = tokyoFiltersFormElement.querySelector('#housing_features');
  var featuresListElement = tokyoFiltersetElement.querySelectorAll('input'); // свойство elements не работает в Edge;

  var isGreaterThan = function (value, min) {
    return value > min;
  };

  var isLessThan = function (value, max) {
    return value < max;
  };

  var isInRange = function (value, min, max) {
    return value >= min && value <= max;
  };

  var checkRange = function (value, filterValue) {
    if (filterValue === NO_FILTER) {
      return true;
    }
    if (filterValue.min === NO_FILTER) {
      return isLessThan(value, filterValue.max);
    }
    if (filterValue.max === NO_FILTER) {
      return isGreaterThan(value, filterValue.min);
    }
    return isInRange(value, filterValue.min, filterValue.max);
  };

  var checkValue = function (value, filterValue) {
    return filterValue === NO_FILTER ? true : value === filterValue;
  };

  var isIncludeList = function (list, filterList) {
    return Array.prototype.every.call(filterList, function (filter) {
      return list.indexOf(filter) >= 0;
    });
  };

  var getFeaturesForFilter = function () {
    return Array.prototype.map.call(Array.prototype.filter.call(featuresListElement, function (feature) {
      return feature.checked;
    }), function (featureChecked) {
      return featureChecked.value;
    });
  };

  var getPriceRangeForFilter = function (rangeStr) {
    return priceRange[rangeStr];
  };

  var getFilteredOffers = function (offers) {
    return offers.filter(function (item) {
      return checkRange(item.offer.price, filterSet[FILTER_PRICE]) &&
      checkValue(String(item.offer.type), filterSet[FILTER_HOUSE_TYPE]) &&
      checkValue(String(item.offer.rooms), filterSet[FILTER_ROOMS_NUMBER]) &&
      checkValue(String(item.offer.guests), filterSet[FILTER_GUESTS_NUMBER]) &&
      isIncludeList(item.offer.features, filterSet[FILTER_FEATURES]);
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

  var updateAndRunFilter = function (filter, value) {
    filterSet[filter] = value;
    window.debounce(updatePins);
  };

  var onFilterElementChange = function (evt) {
    var filter = String(evt.target.dataset.filter);
    switch (filter) {
      case FILTER_HOUSE_TYPE:
      case FILTER_GUESTS_NUMBER:
      case FILTER_ROOMS_NUMBER:
        updateAndRunFilter(filter, evt.target.value);
        break;
      case FILTER_PRICE:
        updateAndRunFilter(filter, getPriceRangeForFilter(evt.target.value));
        break;
      case FILTER_FEATURES:
        updateAndRunFilter(filter, getFeaturesForFilter());
        break;
    }
  };

  var onTokyoFiltersFormElementLoad = function () {
    initFilters();
    tokyoFiltersFormElement.addEventListener('change', onFilterElementChange);
  };

  var initFilters = function () {
    filterSet[FILTER_HOUSE_TYPE] = housingTypeElement.value;
    filterSet[FILTER_PRICE] = getPriceRangeForFilter(housingPriceElement.value);
    filterSet[FILTER_ROOMS_NUMBER] = housingRoomNumberElement.value;
    filterSet[FILTER_GUESTS_NUMBER] = housingGuestsNumberElement.value;
    filterSet[FILTER_FEATURES] = getFeaturesForFilter();
  };

  window.addEventListener('load', onTokyoFiltersFormElementLoad);
})();
