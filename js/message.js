'use strict';

(function () {
  var actionStatus = {
    error: 0,
    success: 1
  };

  var alignTop = function (element) {
    element.style.top = '15%';
  };

  var alignBottom = function (element) {
    element.style.bottom = '15%';
  };

  var createMessageElement = function (alignMessage) {
    var element = document.createElement('div');
    element.className = 'message';
    element.style.zIndex = '100';
    element.style.margin = '0 auto';
    element.style.padding = '10px';
    element.style.position = 'absolute';
    switch (alignMessage) {
      case window.message.verticalAlignMessage.top:
        alignTop(element);
        break;
      case window.message.verticalAlignMessage.bottom:
        alignBottom(element);
        break;
    }
    element.style.left = '0';
    element.style.right = '0';
    element.style.width = '40%';
    element.style.textAlign = 'center';
    element.style.fontSize = '18px';
    return element;
  };

  var showMessage = function (message, status, parentElement, alignMessage) {
    var element = parentElement.querySelector('.message');
    if (!element) {
      element = createMessageElement(alignMessage);
    }
    element.textContent = message;
    element.style.backgroundColor = status ? '#FFFACD' : '#FF6347';
    element.classList.remove('hidden');
    parentElement.insertAdjacentElement('afterbegin', element);
    return element;
  };

  window.message = {
    verticalAlignMessage: {
      top: 0,
      bottom: 1
    },

    showError: function (errorMessage, parentElement, alignMessage) {
      return showMessage(errorMessage, actionStatus.error, parentElement, alignMessage);
    },

    showNotice: function (errorMessage, parentElement, alignMessage) {
      return showMessage(errorMessage, actionStatus.success, parentElement, alignMessage);
    }
  };
})();
