"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ** Declare Custome Axios
var request = function request(_ref) {
  var endpoint, method, params, callback, property, response;
  return regeneratorRuntime.async(function request$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          endpoint = _ref.endpoint, method = _ref.method, params = _ref.params, callback = _ref.callback;
          property = {
            method: method,
            url: endpoint,
            data: params
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _axios["default"])(property));

        case 5:
          response = _context.sent;

          if (!callback) {
            _context.next = 10;
            break;
          }

          callback(response);
          _context.next = 11;
          break;

        case 10:
          return _context.abrupt("return", response);

        case 11:
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", _context.t0.toString());

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

var _default = request;
exports["default"] = _default;