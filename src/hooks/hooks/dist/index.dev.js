"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLoading = exports.useChart = exports.useWeb3 = exports.useWebVital = exports.useApi = void 0;

var _report = _interopRequireDefault(require("./_report"));

var actions = _interopRequireWildcard(require("./_api"));

var web3 = _interopRequireWildcard(require("./_web3"));

var chart = _interopRequireWildcard(require("./_chart"));

var loading = _interopRequireWildcard(require("./_loading"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var useApi = function useApi() {
  return actions;
};

exports.useApi = useApi;

var useWebVital = function useWebVital() {
  return _report["default"];
};

exports.useWebVital = useWebVital;

var useWeb3 = function useWeb3() {
  return web3;
};

exports.useWeb3 = useWeb3;

var useChart = function useChart() {
  return chart;
};

exports.useChart = useChart;

var useLoading = function useLoading() {
  return loading;
};

exports.useLoading = useLoading;