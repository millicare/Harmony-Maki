import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

const initValue = {};

let globalSetMode = () => {
    return {};
};

export const useERC20Pool = singletonHook(initValue, () => {
    const pool = (JSON.parse(window.localStorage.getItem("ERC20_Pool"))) || initValue;
    const [mode, setMode] = useState(pool);

    globalSetMode = setMode;
    return mode;
});

export const setERC20Pool = (pool) => {
    globalSetMode(pool);
};