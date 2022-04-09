"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hide = exports.show = void 0;

var show = function show() {
  var loading = document.getElementById("spinner");
  loading.style.display = "flex";
  return true;
};

exports.show = show;

var hide = function hide() {
  var loading = document.getElementById("spinner");
  loading.style.display = "none";
  return true;
};

exports.hide = hide;