'use strict';

(function () {
  var xhrLoad = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 2000;
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Неверный запрос');
          break;
        case 404:
          onError('Ничего не найдено');
          break;
        default:
          onError('Статус ' + xhr.status + ': ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышение времени ожидания: ' + Math.floor(xhr.timeout / 1000) + 'с');
    });

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError, url) {
      var xhr = xhrLoad(onLoad, onError);
      xhr.open('GET', url);
      xhr.send();
    },

    save: function (data, onLoad, onError, url) {
      var xhr = xhrLoad(onLoad, onError);
      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();
