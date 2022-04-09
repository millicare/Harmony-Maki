import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect, ledger, torus } from "./connectors";
import MetaMaskLogo from "../images/wallets/meta-mask.svg";
import Ledger from "../images/wallets/ledger.svg";
import WalletConnect from "../images/wallets/wallet-connect.svg";
import Torus from "../images/wallets/torus.svg";

const Wallets = [
    {
        title: "MetaMask",
        description: "Connect to your MetaMask Wallet",
        logo: MetaMaskLogo,
        connector: injected,
    },
    {
        title: "WalletConnect",
        description: "Connect to your WalletConnect Wallet",
        logo: WalletConnect,
        connector: walletconnect,
    },
    {
        title: "Ledger",
        description: "Connect to your Ledger Wallet",
        logo: Ledger,
        connector: ledger,
    },
    {
        title: "Torus",
        description: "Connect to your Torus Wallet",
        logo: Torus,
        connector: torus,
    },
];

const ConnectedWallet = () => {
    const { connector } = useWeb3React();
    if (connector) {
        switch (connector) {
            case injected: {
                return {
                    name: "MetaMask",
                    logo: MetaMaskLogo,
                };
            }
            case walletconnect: {
                return {
                    name: "WalletConnect",
                    logo: WalletConnect,
                };
            }
            case ledger: {
                return {
                    name: "Ledger",
                    logo: Ledger,
                };
            }
            case torus: {
                return {
                    name: "Torus",
                    logo: Torus,
                };
            }
            default: 
                break;
        }
    } else {
        return {};
    }
};

export { Wallets, ConnectedWallet };
