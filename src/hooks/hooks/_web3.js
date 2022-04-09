import Cookies from 'js-cookie'
// ** Import Redux
import {
    network_store,
} from "../redux/actions/web3";

export const connectWallet = async (id, dispatch, callback) => {
    if (id === "MetaMask") {
        if (window.ethereum) {
            (async () => {
                try {
                    Cookies.set('isConnectedWallet', 'MetaMask');
                } catch (e) {
                    console.log(e.toString());
                }
            })();
        } else {
            alert("Please install MetaMask on your Chrome", "error");
            callback(true);
        }
    }
};

export const switchNetwork = (dispatch) => {
    const chainId = 137;
    window.ethereum
        .request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: `0x${chainId.toString(16)}`,
                    chainName: "Matic Network",
                    rpcUrls: [
                        "https://rpc-mainnet.maticvigil.com",
                        "https://rpc-mainnet.matic.quiknode.pro",
                        "https://matic-mainnet.chainstacklabs.com",
                    ],
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18,
                    },
                    blockExplorerUrls: [
                        "https://explorer-mainnet.maticvigil.com",
                    ],
                },
            ],
        })
        .then(() => {
            dispatch(network_store(`0x${chainId.toString(16)}`))
        })
        .catch((error) => {
            alert(error.toString(), "error");
        });
};
