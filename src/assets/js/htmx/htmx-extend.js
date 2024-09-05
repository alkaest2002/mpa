export const jsonEnc = {
  onEvent: function (name, evt) {
    if (name === "htmx:configRequest") {
      evt.detail.headers["Content-Type"] = "application/json";
    }
  },
  encodeParameters: function (xhr, parameters, elt) {
    xhr.overrideMimeType("text/json");
    return JSON.stringify(parameters);
  },
};

export const morph = {
  isInlineSwap: function (swapStyle) {
    return swapStyle === "morph";
  },
  handleSwap: function (swapStyle, target, fragment) {
    if (swapStyle === "morph") {
      if (fragment.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        Alpine.morph(target, fragment.firstElementChild);
        return [target];
      } else {
        Alpine.morph(target, fragment.outerHTML);
        return [target];
      }
    }
  },
};
