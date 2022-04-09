import React, { useEffect } from "react";

import { current_detailed_coin } from "../redux/actions/coin";
import { useSelector, useDispatch } from "react-redux";
import { useApi, useLoading } from "../hooks";

const RealtimeProvider = ({ children }) => {
    const api = useApi();
    const loading = useLoading();

    const dispatch = useDispatch();
    const { current_coin } = useSelector((state) => state.coin);

    useEffect(() => {
        const updateData = () => {
            current_coin.id &&
                (() => {
                    api.getCoinData(current_coin.id, (data) => {
                        dispatch(current_detailed_coin(data));
                        loading.hide();
                    });
                })();
        };
        updateData();
    }, [api, current_coin, dispatch, loading]);
    return <>{children}</>;
};

export default RealtimeProvider;
