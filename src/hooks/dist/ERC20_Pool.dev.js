"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setERC20Pool = exports.useERC20Pool = void 0;

var _react = require("react");

var _reactSingletonHook = require("react-singleton-hook");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var initValue = {};

var globalSetMode = function globalSetMode() {
  return {};
};

var useERC20Pool = (0, _reactSingletonHook.singletonHook)(initValue, function () {
  var pool = JSON.parse(window.localStorage.getItem("ERC20_Pool")) || initValue;

  var _useState = (0, _react.useState)(pool),
      _useState2 = _slicedToArray(_useState, 2),
      mode = _useState2[0],
      setMode = _useState2[1];

  globalSetMode = setMode;
  return mode;
});
exports.useERC20Pool = useERC20Pool;

var setERC20Pool = function setERC20Pool(pool) {
  globalSetMode(pool);
};

exports.setERC20Pool = setERC20Pool;