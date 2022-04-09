"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchNetwork = exports.connectWallet = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _web = require("../redux/actions/web3");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// ** Import Redux
var connectWallet = function connectWallet(id, dispatch, callback) {
  return regeneratorRuntime.async(function connectWallet$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (id === "MetaMask") {
            if (window.ethereum) {
              (function _callee() {
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        try {
                          _jsCookie["default"].set('isConnectedWallet', 'MetaMask');
                        } catch (e) {
                          console.log(e.toString());
                        }

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              })();
            } else {
              alert("Please install MetaMask on your Chrome", "error");
              callback(true);
            }
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.connectWallet = connectWallet;

var switchNetwork = function switchNetwork(dispatch) {
  var chainId = 137;
  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x".concat(chainId.toString(16)),
      chainName: "Matic Network",
      rpcUrls: ["https://rpc-mainnet.maticvigil.com", "https://rpc-mainnet.matic.quiknode.pro", "https://matic-mainnet.chainstacklabs.com"],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      blockExplorerUrls: ["https://explorer-mainnet.maticvigil.com"]
    }]
  }).then(function () {
    dispatch((0, _web.network_store)("0x".concat(chainId.toString(16))));
  })["catch"](function (error) {
    alert(error.toString(), "error");
  });
};

exports.switchNetwork = switchNetwork;