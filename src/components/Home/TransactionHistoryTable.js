// import transitions from "@material-ui/core/styles/transitions";
import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import ReactPaginate from "react-paginate";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import { getByteCodeSignatureByHash, getRelatedTransactionsByType } from "../../client"
import { getAddress } from "../../utils/GetAddress";

// import transactionHistory from "../../test/transactionHistory";

export const TransactionHistoryTable = ({ perPage, isMobile }) => {
  const [offset, setOffset] = useState(0);
  const [transactions, setTransactions] = useState([])
  const { account } = useWeb3React();
  const [pageCount, setPageCount] = useState(
    Math.ceil(transactions.length / perPage)
  );
  const [data, setData] = useState(
    transactions.slice(offset, offset + perPage)
  );
  const [whichSorted, setWhichSorted] = useState("date");
  const [arrowSorted, setArrowSorted] = useState(0); //0: accending	1: desending

  const [isFirstLoading, setIsFirstLoading] = useState(true);

  useEffect(() => {
    setData(transactions.slice(offset, offset + perPage))
  }, [transactions.length])

  useEffect(() => {
    //get transaction history
    
    const getElements = async () => {
      let id = '0x0ab8894cda70a6efd32ce7563834444e2811b182';
      id = id.slice(0, 3) === "one" ? getAddress(id).basicHex : id;
      try{
        let relatedTransactions = await getRelatedTransactionsByType([
          0,
          id,
          'transaction',
          'gte',
        ]);

        const methodSignatures = await Promise.all(
          relatedTransactions.map((tx) => {
            return tx.input && tx.input.length > 10
            ? getByteCodeSignatureByHash([tx.input.slice(0, 10)])
            : Promise.resolve([]);
          })
        );
        relatedTransactions = relatedTransactions.map((l, i) => ({
          ...l,
          signatures: methodSignatures[i],
        }));
        setTransactions(relatedTransactions)
      } catch (err) {
        console.log(err)
      }
    }
    getElements();
  }, [])

  const handlePageClick = (data) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setIsFirstLoading(false);
    setOffset(offset);
    setData(transactions.slice(offset, offset + perPage));
  };
  useEffect(() => {
    if (!isFirstLoading) {
      window.scrollTo({
        top: 99999999999,
        left: 0,
        behavior: "smooth",
      });
    }
    //loadCommentsFromServer();
  }, [offset]);

  function sortTH(element) {
    setWhichSorted(element);
    if (whichSorted !== element) {
      setArrowSorted(0);
    } else {
      setArrowSorted(!arrowSorted);
    }
  }

  function SortSign({ element }) {
    return (
      <>
        {whichSorted === element ? (
          arrowSorted === 0 ? (
            <ArrowUpwardIcon />
          ) : (
            <ArrowDownwardIcon />
          )
        ) : (
          <ImportExportIcon />
        )}
      </>
    );
  }
  function convert(timestamp) {
    var date = new Date(timestamp);
    return [
      date.getFullYear(),                      
      ("0" + (date.getMonth()+1)).slice(-2),
      ("0" + date.getDate()).slice(-2)
    ].join('-');
  }

  function getSignature(data) {
    let signature;
    try {
      signature = data.length && data[0]['signature'].split("(")[0];
    } catch (err) {}

    if(!signature) {
      return "-";
    }

    return signature;
  }

  // function getType(from, to){
  //   let type;
  //   if(account){
  //     if(from === account){
  //       type = 'Send';
  //     }else if(to === account){
  //       type = 'Receive';
  //     }else {
  //       type = '';
  //     }
  //   }
  //   return type;
  // }

  return (
    <div className="dark:text-white mx-2" style={{width: isMobile && '100%', overflowX: isMobile && 'scroll'}}>
      <div className="grid my-6 justify-items-end">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination_container"}
          activeLinkClassName={"pagination_page_active"}
          pageLinkClassName={"pagination_page_link"}
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-pink-300 appear_cursor">
            <th className="text-left w-40" onClick={() => sortTH("date")}>
              <span>Date</span>
              <SortSign element="date" />
            </th>
            <th className="text-center w-40" onClick={() => sortTH("type")}>
              <span>Type</span>
              <SortSign element="type" />
            </th>
            <th className="text-right" onClick={() => sortTH("from")}>
              <span>From</span>
              <SortSign element="price_usd" />
            </th>
            <th className="text-right" onClick={() => sortTH("to")}>
              <span>To</span>
              <SortSign element="price_eth" />
            </th>
            <th className="text-right" onClick={() => sortTH("amount")}>
              <span>Amount</span>
              <SortSign element="amount" />
            </th>
            {/* <th className="text-right" onClick={() => sortTH("total_eth")}>
              <span>Price USD</span>
              <SortSign element="total_eth" />
            </th> */}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((transaction, i) => (
            <tr
              className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              key={i}
            >
              <td className="text-left py-2 w-40">{convert(transaction.timestamp)}</td>
              <td className="text-center text-blue-500">{getSignature(transaction.signatures)}</td>
              <td className="text-right">{transaction.from}</td>
              <td className="text-right">{transaction.to}</td>
              <td className="text-right">{transaction.value}</td>
              {/* <td className="text-right">{transaction.total_eth}</td> */}
            </tr>
          )) :
          <tr className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            <td colSpan="5" className="text-center pt-5">There is no transaction now.</td>
          </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

