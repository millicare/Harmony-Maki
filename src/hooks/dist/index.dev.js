"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEagerConnect = useEagerConnect;
exports.useInactiveListener = useInactiveListener;
exports.useLoading = exports.useApi = void 0;

var _react = require("react");

var _core = require("@web3-react/core");

var _connectors = require("../constant/connectors");

var loading = _interopRequireWildcard(require("./_loading"));

var actions = _interopRequireWildcard(require("./_api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useEagerConnect() {
  var _useWeb3React = (0, _core.useWeb3React)(),
      activate = _useWeb3React.activate,
      active = _useWeb3React.active;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      tried = _useState2[0],
      setTried = _useState2[1];

  (0, _react.useEffect)(function () {
    _connectors.injected.isAuthorized().then(function (isAuthorized) {
      if (isAuthorized) {
        activate(_connectors.injected, undefined, true)["catch"](function () {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))
  // if the connection worked, wait until we get confirmation of that to flip the flag

  (0, _react.useEffect)(function () {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);
  return tried;
}

function useInactiveListener() {
  var suppress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var _useWeb3React2 = (0, _core.useWeb3React)(),
      active = _useWeb3React2.active,
      error = _useWeb3React2.error,
      activate = _useWeb3React2.activate;

  (0, _react.useEffect)(function () {
    var _window = window,
        ethereum = _window.ethereum;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      var handleChainChanged = function handleChainChanged(chainId) {
        console.log("chainChanged", chainId);
        activate(_connectors.injected);
      };

      var handleAccountsChanged = function handleAccountsChanged(accounts) {
        console.log("accountsChanged", accounts);

        if (accounts.length > 0) {
          activate(_connectors.injected);
        }
      };

      var handleNetworkChanged = function handleNetworkChanged(networkId) {
        console.log("networkChanged", networkId);
        activate(_connectors.injected);
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);
      return function () {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }

    return function () {};
  }, [active, error, suppress, activate]);
}

var useApi = function useApi() {
  return actions;
};

exports.useApi = useApi;

var useLoading = function useLoading() {
  return loading;
};

exports.useLoading = useLoading;