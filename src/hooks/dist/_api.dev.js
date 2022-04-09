"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalData = exports.getCoinData = exports.getCoinsMarkets = exports.getCoinsList = exports.getMarketData = exports.getCurrentPrice = void 0;

var _axios = _interopRequireDefault(require("./_axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ** Declare Auth API
var getCurrentPrice = function getCurrentPrice(coinId, vsCurrency) {
  var _ref, data;

  return regeneratorRuntime.async(function getCurrentPrice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=".concat(coinId, "&vs_currencies=").concat(vsCurrency),
            method: "GET"
          }));

        case 2:
          _ref = _context.sent;
          data = _ref.data;

          if (!data) {
            _context.next = 14;
            break;
          }

          _context.prev = 5;
          return _context.abrupt("return", data[coinId][vsCurrency]);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](5);
          return _context.abrupt("return", 0);

        case 12:
          _context.next = 15;
          break;

        case 14:
          return _context.abrupt("return", 0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 9]]);
};

exports.getCurrentPrice = getCurrentPrice;

var getMarketData = function getMarketData(coinId, vsCurrency, days, interval, cb) {
  (0, _axios["default"])({
    endpoint: "https://api.coingecko.com/api/v3/coins/".concat(coinId, "/market_chart?vs_currency=").concat(vsCurrency, "&days=").concat(days, "&interval=").concat(interval),
    method: "GET",
    callback: function callback(_ref2) {
      var data = _ref2.data;

      if (data) {
        cb(data);
      } else {
        cb({});
      }
    }
  });
};

exports.getMarketData = getMarketData;

var getCoinsList = function getCoinsList(isPlatform, cb) {
  (0, _axios["default"])({
    endpoint: "https://api.coingecko.com/api/v3/coins/list?include_platform=".concat(isPlatform),
    method: "GET",
    callback: function callback(_ref3) {
      var data = _ref3.data;

      if (data) {
        cb(data);
      } else {
        cb([]);
      }
    }
  });
};

exports.getCoinsList = getCoinsList;

var getCoinsMarkets = function getCoinsMarkets(vsCurrency, ids, order, perPage, page, sparkline, cb) {
  (0, _axios["default"])({
    endpoint: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=".concat(vsCurrency, "&ids=").concat(ids, "&order=").concat(order, "&per_page=").concat(perPage, "&page=").concat(page, "&sparkline=").concat(sparkline),
    method: "GET",
    callback: function callback(_ref4) {
      var data = _ref4.data;

      if (data) {
        cb(data);
      } else {
        cb([]);
      }
    }
  });
};

exports.getCoinsMarkets = getCoinsMarkets;

var getCoinData = function getCoinData(coinId, cb) {
  (0, _axios["default"])({
    endpoint: "https://api.coingecko.com/api/v3/coins/".concat(coinId),
    method: "GET",
    callback: function callback(_ref5) {
      var data = _ref5.data;

      if (data) {
        cb(data);
      } else {
        cb([]);
      }
    }
  });
};

exports.getCoinData = getCoinData;

var getGlobalData = function getGlobalData(cb) {
  (0, _axios["default"])({
    endpoint: "https://api.coingecko.com/api/v3/global",
    method: "GET",
    callback: function callback(_ref6) {
      var data = _ref6.data;

      if (data) {
        cb(data);
      } else {
        cb({});
      }
    }
  });
};

exports.getGlobalData = getGlobalData;