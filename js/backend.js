'use strict';

(function () {
  var STATUS_OK = 200;
  var STATUS_NOCORRECT = 400;
  var STATUS_NOT_FOUND = 404;
  var XHR_TIMEOUT = 4000; // мс

  var xhrLoad = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = XHR_TIMEOUT;
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case STATUS_OK:
          onLoad(xhr.response);
          break;
        case STATUS_NOCORRECT:
          onError('Неверный запрос');
          break;
        case STATUS_NOT_FOUND:
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
      onError('Превышение времени ожидания: ' + xhr.timeout + 'мс');
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
