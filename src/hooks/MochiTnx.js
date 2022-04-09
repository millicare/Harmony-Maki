import React from "react";
import { mochiClient } from "../client/ApolloClient";
import { mochiTransactions } from "../client/ApolloQuery";

export const getPairTransactions = async (pairAddress) => {
    const transactions = {}
  
    try {
      let result = await mochiClient.query({
        query: mochiTransactions,
        variables: {
          allPairs: [pairAddress],
        },
        fetchPolicy: 'no-cache',
      })
      transactions.mints = result.data.mints
      transactions.burns = result.data.burns
      transactions.swaps = result.data.swaps
    } catch (e) {
        console.log(e)
    }
    
    console.log(pairAddress, transactions, "==============result trans===================")
    return transactions
  }