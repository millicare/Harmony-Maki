import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { TorusConnector } from "@web3-react/torus-connector";

const POLLING_INTERVAL = 12000;
const RPC_URL = "https://api.s0.t.hmny.io";

export const injected = new InjectedConnector({
    supportedChainIds: [1666600000, 1666600001, 1666600002, 1666600003],
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 137: RPC_URL },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

export const ledger = new LedgerConnector({
    chainId: 137,
    url: RPC_URL,
    pollingInterval: POLLING_INTERVAL,
});

export const torus = new TorusConnector({ chainId: 137 });
