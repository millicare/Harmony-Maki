import report from "./_report";
import * as actions from "./_api";
import * as web3 from "./_web3";
import * as chart from "./_chart";
import * as loading from "./_loading";

export const useApi = () => {
    return actions;
};

export const useWebVital = () => {
    return report;
};

export const useWeb3 = () => {
    return web3;
}

export const useChart = () => {
    return chart;
}

export const useLoading = () => {
    return loading;
}