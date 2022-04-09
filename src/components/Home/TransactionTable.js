import React, { useState, useEffect } from "react";
import {
    transactionsQuery,
} from "../../client/ApolloQuery";
import { useQuery } from "@apollo/client";
import SortableTable from "./SortableTable";
import { Typography } from "@material-ui/core";
import formatDistance from "date-fns/formatDistance";
import { makeStyles } from "@material-ui/core/styles";
import Spinner from "../Spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));
const locales = ["en-US"];
const currencyFormatter = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
});

const decimalFormatter = new Intl.NumberFormat(locales, {
    style: "decimal",
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 4,
});

export default function Transactions({ id, mode }) {
  const [isLoading, setLoading] = useState(true)
  //get transaction of each pair
  const {data: transactions, loading} = useQuery(transactionsQuery, {
    variables: { pairAddresses: [id] },
    pollInterval: 60000,
  });


  const classes = useStyles();
  const rows = transactions && [
    ...transactions?.swaps,
    ...transactions?.mints,
    ...transactions?.burns,
  ].map((transaction) => {
    if (transaction.__typename === "Swap") {
      return {
        ...transaction,
        amount0:
          transaction.amount0In === "0"
            ? transaction.amount1In
            : transaction.amount0In,
        amount1:
          transaction.amount1Out === "0"
            ? transaction.amount0Out
            : transaction.amount1Out,
      };
    }

    return transaction;
  });

  const now = new Date();

  useEffect(() => {
    setLoading(loading);
  }, [loading])

  return (
    <div className={classes.root}>
      <Spinner isLoading={isLoading} />
      {rows && rows.length > 0 && <SortableTable
        mode={mode}
        title="Transactions"
        orderBy="timestamp"
        columns={[
          {
            key: "__typename",
            label: "Type",
            render: (row) => { 
              return (
              <Typography variant="body2" noWrap>
                {row.__typename}{" "}
                {row.amount0In === "0" || row.__typename === 'Mint' && !row.amount0In
                  ? row.pair.token1.symbol
                  : row.pair.token0.symbol}{" "}
                to{" "}
                {row.amount1Out === "0" || row.__typename === 'Mint' && !row.amount1Out
                  ? row.pair.token0.symbol
                  : row.pair.token1.symbol}
              </Typography>
            ) },
          },
          {
            key: "amountUSD",
            align: "right",
            label: "Value",
            render: (row) => currencyFormatter.format(row.amountUSD),
          },
          {
            key: "amount0",
            align: "right",
            label: "In",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {decimalFormatter.format(row.amount0)}{" "}
                {row.amount1In === "0" || !row.amount1In
                  ? row.pair.token0.symbol
                  : row.pair.token1.symbol}
              </Typography>
            ),
          },
          {
            key: "amount1",
            align: "right",
            label: "Out",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {decimalFormatter.format(row.amount1)}{" "}
                {row.amount0Out === "0" || !row.amount0Out
                  ? row.pair.token1.symbol
                  : row.pair.token0.symbol}
              </Typography>
            ),
          },
          {
            key: "to",
            label: "To",
            render: (row) => (
              <a href={`https://explorer.harmony.one/#/address/${row.to}`}>
                {row.to}
              </a>
            ),
          },
          {
            key: "timestamp",
            align: "right",
            label: "Time",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {formatDistance(now, new Date(row.timestamp * 1000))} ago
              </Typography>
            ),
          },
        ]}
        rows={rows}
      />}
    </div>
  );
}
