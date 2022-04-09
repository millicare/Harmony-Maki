import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useMedia } from "react-use";
import axios from "axios";
import Big from "big.js";
import { useWeb3React } from "@web3-react/core";
import { Button, Modal } from "@material-ui/core";
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Backdrop from "@material-ui/core/Backdrop";
// import Brightness4Icon from "@material-ui/icons/Brightness4";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import SearchIcon from "@material-ui/icons/Search";
import Switch from '@material-ui/core/Switch';
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {CopyToClipboard} from 'react-copy-to-clipboard';
// import TradingViewWidget, { Themes } from "react-tradingview-widget";

import Transactions from "./Home/TransactionTable";
import MochiTransactions from "./Home/MochiTransactionTable";
import { getPairTransactions } from "../hooks/MochiTnx";
// import ConnectWallet from "./ConnectWallet";
// import MetaMask from "../images/wallets/meta-mask.svg";
import {
  ethPriceQuery,
  pairsQuery,
  pairDayDatasQuery,
  mochipairsQuery,
  mochiPairDayDatasQuery
} from "../client/ApolloQuery";
import { useQuery } from "@apollo/client";
import { mochiClient  } from "../client/ApolloClient";
import { TokenIcon } from "./Home/TokenIcon";
import { PriceChart } from "./Home/PriceChart";
import { VolumeChart } from "./Home/VolumeChart";
import { LiquidityChart } from "./Home/LiquidityChart";
import { TxCountChart } from "./Home/TxCountChart";
import { MarketCapChart } from "./Home/MarketCapChart";
import Loading from "./Loading";
import Spinner from "./Spinner";
import { useERC20Pool } from "../hooks/ERC20_Pool";
// import { ERC20_Pool } from "./Home/ERC20_Pool";
import { getAllERC20 } from "../client"
import { useParams } from "react-router-dom";

// const useStyles = makeStyles({
//   "@global": {
//     "*::-webkit-scrollbar": {
//       width: "0.4em",
//     },
//     "*::-webkit-scrollbar-track": {
//       "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
//     },
//     "*::-webkit-scrollbar-thumb": {
//       backgroundColor: "rgba(0,0,0,0)",
//       outline: "1px solid slategrey",
//     },
//   },
// });
const IOSSwitch = withStyles((theme) =>
    createStyles({
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        padding: 1,
        '&$checked': {
          transform: 'translateX(16px)',
          color: theme.palette.common.white,
          '& + $track': {
            backgroundColor: '#52d869',
            opacity: 1,
            border: 'none',
          },
        },
        '&$focusVisible $thumb': {
          color: '#52d869',
          border: '6px solid #fff',
        },
      },
      thumb: {
        width: 24,
        height: 24,
      },
      track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
      },
      checked: {},
      focusVisible: {},
    }),
  )(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

function App(props) {
  const isMobile = useMedia('(max-width: 800px)');
  const [isLoading, setLoading] = useState(true)
  const [orderTab, setOrderTab] = useState(1);
  const [theme, setTheme] = useState("dark");
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [mochiPairs, setMochiPairs] = useState([])
  const [mochiChartData, setMochiChartData] = useState([])
  const [fetchDayData, setFetchDayData] = useState({})
  const [openWalletList, setOpenWalletList] = useState(false);
  const { account } = useWeb3React();
  const [mochitransactions, setMochiTransactions] = useState([]);

  const [openSearchModal, setOpenSearchModal] = useState(false);
  // const [totalVolume, setTotalVolume] = useState();
  const [searchX, setSearchX] = useState(0);
  const [searchY, setSearchY] = useState(0);
  const [searchWidth, setSearchWidth] = useState(0);
  const [pairlist, setPairs] = useState([]);
  const [ethPrice, setEthPrice] = useState();
  const [ismochi, setMochi] = useState(false);
  const [row, setRow] = useState('0x40d2f81bd135b5282cb2aa18f19cf7098079d012');
  const [onePrice, setOnePrice] = useState();
  const [checked, setChecked] = useState(false);
  const erc20Map = useERC20Pool();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchPairs() {
      mochiClient
        .query({
          query: mochipairsQuery,
        })
        .then((res) => {
          setMochiPairs(res.data.pairs)
        })
        .catch((e) => {
          console.log(e)
        })
    }
    setInterval(
      () => {
        fetchPairs();
      },
      mochiPairs.length > 0 ? 60000 : 10000
    );
    // fetchPairs()
  }, [mochiPairs, pairlist])

  const { data: ethPriceData } = useQuery(ethPriceQuery, {
    pollInterval: 60000,
  });

  useEffect(() => {
    if (ethPriceData) {
      setEthPrice(ethPriceData.bundles[0].ethPrice);
    }
  }, [ethPriceData])

  const { data: pairs } = useQuery(pairsQuery, {
    pollInterval: 60000,
  });

  useEffect(() => {
    if(pairs?.pairs.length || mochiPairs.length){
      let filtered_pairs = ismochi ? mochiPairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0") : pairs?.pairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0")
      if(!checked && !ismochi){
        filtered_pairs = pairs?.pairs
      }
      setPairs(filtered_pairs)
      setLoading(false)
    }
  }, [pairs?.pairs.length, mochiPairs.length])

//  useEffect(() => {
   if(ismochi && mochiPairs.filter(pair => pair.token0.id === row).length > 0){
      async function fetch() {
        mochiClient
          .query({
            query: mochiPairDayDatasQuery,
            variables: {
              pairs: [pairlist && pairlist.filter(pair => pair.token0.id === row)[0]?.id],
            },
          })
          .then((res) => {
            setFetchDayData(res.data)
          })
          .catch((e) => {
            console.log(e)
          })
      }
      if(!fetchDayData){  
        setInterval(
          () => {
            fetch();
          },
          fetchDayData.length > 0 ? 60000 : 10000
        );
      }else{
        fetch();
      }
    }
  // }, [row, mochiPairs.length, ismochi])

  useEffect(() => {
    try {
      axios.get('https://api.coingecko.com/api/v3/coins/harmony')
      .then(response => {
          // setTotalVolume(response.data.market_data?.total_volume?.usd)
          setOnePrice(response.data.market_data?.current_price?.usd)
      })
    } catch (e) {
        console.log(`Axios request failed: ${e}`)
    }
  }, [openSearchModal, pairlist])

  useEffect(() => {
    // if (
    //   localStorage.theme === "dark" ||
    //   (!"theme" in localStorage &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches)
    // ) {
    //   document.querySelector("html").classList.add("dark");
    // } else if (localStorage.theme === "dark") {
    //   document.querySelector("html").classList.add("dark");
    // }
    document.querySelector("html").classList.add("dark");
    if(id){
      setRow(id)
    }else{
      setRow('0x40d2f81bd135b5282cb2aa18f19cf7098079d012')
    }
  }, []);

  const { data, loading } = useQuery(pairDayDatasQuery, {
    variables: {
      pairs: [pairlist && pairs?.pairs.filter(pair => pair.token0.id === row).length > 0 && pairlist.filter(pair => pair.token0.id === row)[0]?.id],
    },
    pollInterval: 60000,
  });

  const chartDatas = data && data.pairDayDatas.length > 0 && data.pairDayDatas.reduce(
    (previousValue, currentValue) => {
      const untrackedVolumeUSD =
        currentValue?.token0.derivedETH * currentValue?.volumeToken0 +
        currentValue?.token1.derivedETH *
          currentValue?.volumeToken1 *
          ethPrice;

      const volumeUSD =
        currentValue?.volumeUSD === "0"
          ? untrackedVolumeUSD
          : currentValue?.volumeUSD;

      previousValue["liquidity"].unshift([
          currentValue.date*1000,
          parseFloat(currentValue.reserveUSD).toFixed(4),
        ]);

      previousValue["volume"].unshift([
        currentValue.date*1000,
        parseFloat(volumeUSD).toFixed(2),
      ]);

      previousValue["price"].unshift([
        currentValue.date*1000,
        // parseFloat(currentValue?.token0.derivedETH * ethPrice)
        parseFloat(currentValue?.reserve1 / currentValue?.reserve0 * onePrice).toFixed(6)
      ]);

      previousValue["txcount"].unshift([
        currentValue.date*1000,
        parseFloat(currentValue.txCount).toFixed(4),
      ]);

      previousValue["marketcap"].unshift([
        currentValue.date*1000,
        (parseFloat(currentValue?.reserve1 / currentValue?.reserve0 * onePrice) * parseFloat(Big(erc20Map[pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id]?.totalSupply).div(10 ** erc20Map[pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id]?.decimals))).toFixed(3)
      ]);

      return previousValue;
    },
    { liquidity: [], volume: [], txcount: [], price: [], marketcap: [] }
  );
//============mochiChartData============
  const mochiChartDatas = fetchDayData && fetchDayData.pairDayDatas?.length > 0 && fetchDayData.pairDayDatas.reduce(
    (previousValue, currentValue) => {
      const untrackedVolumeUSD =
        currentValue?.token0.derivedETH * currentValue?.dailyVolumeToken0 +
        currentValue?.token1.derivedETH *
          currentValue?.dailyVolumeToken1 *
          ethPrice;

      const volumeUSD =
        currentValue?.dailyVolumeUSD === "0"
          ? untrackedVolumeUSD
          : currentValue?.dailyVolumeUSD;

      previousValue["mochiliquidity"].unshift([
          currentValue.date*1000,
          parseFloat(currentValue.reserveUSD).toFixed(4),
        ]);

      previousValue["mochivolume"].unshift([
        currentValue.date*1000,
        parseFloat(volumeUSD).toFixed(2),
      ]);

      previousValue["mochiprice"].unshift([
        currentValue.date*1000,
        // parseFloat(currentValue?.token0.derivedETH * ethPrice)
        parseFloat(currentValue?.reserve1 / currentValue?.reserve0 * onePrice).toFixed(6)
      ]);

      previousValue["mochitxcount"].unshift([
        currentValue.date*1000,
        parseFloat(currentValue.dailyTxns).toFixed(4),
      ]);

      previousValue["mochimarketcap"].unshift([
        currentValue.date*1000,
        // (parseFloat(currentValue?.reserve1 / currentValue?.reserve0 * onePrice) * parseFloat(Big(erc20Map[pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id]?.totalSupply).div(10 ** erc20Map[pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id]?.decimals))).toFixed(3)
        (parseFloat(currentValue?.reserve1 / currentValue?.reserve0 * onePrice) * parseFloat(pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.totalSupply)).toFixed(3)
      ]);

      return previousValue;
    },
    { mochiliquidity: [], mochivolume: [], mochitxcount: [], mochiprice: [], mochimarketcap: [] }
  );

  useEffect(() => {
    setMochiChartData(mochiChartDatas)
  }, [fetchDayData])

  // const mochitransactions = ismochi && mochiPairs.length > 0 &&  await getPairTransactions(pairlist.filter(pair => pair.token0.id === row)[0]?.id)
  
  useEffect(() => {
    (async function() {
      if(ismochi && mochiPairs.length > 0){
  
        const fetchTransaction = await getPairTransactions(pairlist.filter(pair => pair.token0.id === row)[0]?.id)
        setMochiTransactions(fetchTransaction)
      }
    })();
  }, [row])
  console.log(mochitransactions, "==============mochitransactions==================")
  
  useEffect(() => {
    const rect = document.getElementById("searchArea").getBoundingClientRect();

    setSearchX(rect.top);
    setSearchY(rect.left);
    setSearchWidth(rect.width);
    console.log("!2");
  }, []);


  // const switchTheme = () => {
  //   let htmlClasses = document.documentElement.classList;
  //   // if (localStorage.theme === "dark") {
  //   //   htmlClasses.remove("dark");
  //   //   localStorage.removeItem("theme");
  //   // } else {
  //     htmlClasses.add("dark");
  //     localStorage.theme = "dark";
  //   // }
  //   setTheme("dark");
  // };

  useEffect(() => {
    if (!isFirstLoading) {
      window.scrollTo({
        top: 99999999999,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [orderTab]);

  function onOrderTabClicked(tab_num) {
    setIsFirstLoading(false);
    setOrderTab(tab_num);
  }

  const SearchModalClose = (id) => {
    if(id.length === undefined && ismochi){
      setRow('0x6008c8769bfacd92251ba838382e7e5637c7e74d')
    }else if(id.length === undefined && !ismochi){
      setRow('0x40d2f81bd135b5282cb2aa18f19cf7098079d012')
    }
    setOpenSearchModal(false);
  };
  function onSearch() {
    setOpenSearchModal(true);
    let filtered_pairs = ismochi ? mochiPairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0") : pairs?.pairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0")
    if(!checked && !ismochi){
      filtered_pairs = pairs?.pairs
    }
    setPairs(filtered_pairs)
  }

  const setValue = (e) => {
    const val = e.target.value
    let pair_filter = pairlist.filter(pair => (pair?.token0?.symbol.toLowerCase().includes(val) || pair?.token1?.symbol.toLowerCase().includes(val) || pair?.token0?.symbol.includes(val.toUpperCase()) || pair?.token1?.symbol.includes(val.toUpperCase())))
    setPairs(pair_filter)
    if(val == ''){
      let filtered_pairs = ismochi ? mochiPairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0") : pairs?.pairs.filter(pair => pair.reserveUSD != "0" && pair.token0?.derivedETH != "0")
      if(!checked && !ismochi){
        filtered_pairs = pairs?.pairs
      }
      setPairs(filtered_pairs)
    }
  }
  const selectRow = (id) => {
    setRow(id)
    SearchModalClose(id);
  }

  const toggleChecked = () => {
    setChecked((prev) => !prev)
  }

  const toggleMochiMode = () => {
    setMochi((prev) => !prev)
  }

  useEffect(() => {
    let tId = 0;
      const getRates = async () => {
        try {
          const erc20 = await getAllERC20();
          const erc20Map = {};
          erc20.forEach((i) => {
            erc20Map[i.address] = i;
          });
  
          window.localStorage.setItem("ERC20_Pool", JSON.stringify(erc20Map));
          // setERC20Pool(erc20Map);
        } finally {
          window.clearTimeout(tId);
          tId = window.setTimeout(getRates, 10 * 60 * 1e3);
        }
      };
  
      tId = window.setTimeout(
        () => {
          getRates();
        },
        window.localStorage.getItem("ERC20_Pool") ? 2000 : 0
      );
  
      return () => {
        clearTimeout(tId);
      };
  }, [])
  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="flex flex-col" style={{background: '#000000'}}>
        <div className="flex mx-8 mt-8 mb-1">
          {/* First Section */}
          <div className={isMobile ? 'flex flex-col' : 'flex flex-col w-80'}>
            <div className="flex flex-row align-middle justify-center">
              <a href="/"><img src="./logo.png" alt="logo" className="w-12 h-12" /></a>
              <h1 className="font-bold text-lg m-3 text-white mt-2">IKURA</h1>
            </div>
          </div>
          {/* Second Section */}
          {!isMobile && <div className="flex flex-col lg:w-1/2 md:w-full mx-2 h-full">
            <div
              className="flex items-center appearance-none w-full py-2 px-4 my-1 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 dark:text-white cursor-pointer"
              id="searchArea"
            >
              <div
                className="flex flex-1 mx-2 items-center justify-between"
                onClick={onSearch}
              >
                <div className="flex flex-row">
                  {pairlist?.length && <div style={{display: 'flex'}}>
                    <TokenIcon id={pairlist.filter(pair => pair?.token0?.id === row)[0]?.token0?.id} style={{width: 26, height:26}} />
                    <TokenIcon id={pairlist.filter(pair => pair?.token0?.id === row)[0]?.token1?.id} style={{width: 26, height:26, marginLeft: -25}} />
                  </div>}
                  <span className="mx-2">{pairlist?.length && (pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.symbol+'-USD')}</span>
                </div>
                {/* <span>${Number(pairlist.length && pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.derivedETH * ethPrice).toFixed(6).toLocaleString()}</span> */}
                {/* <span>${Number(pairlist.length && (pairlist.filter(pair => pair.token0.id === row)[0]?.reserve1 / pairlist.filter(pair => pair.token0.id === row)[0]?.reserve0 * onePrice)).toFixed(6).toLocaleString()}</span> */}
              </div>
            </div>
            {pairlist && pairlist?.length > 0 && <div style={{justifyContent: 'space-around', alignItems: 'baseline', display: 'flex'}}>
              <div style={{alignItems: 'baseline', display: 'flex'}}>
              <div style={{color: 'white'}}>Token: </div>
              <CopyToClipboard text={pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id}>
                  <Button style={{ fontSize: 16, fontWeight: "bold", border: "none", paddingTop: 0, paddingLeft: 0, color: 'white'}} endIcon={<FileCopyOutlinedIcon />}>
                      {pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id.substring(0,8)+"..."+pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id.substring((pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id.length-6), pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id.length)}
                  </Button>
              </CopyToClipboard>
              </div>
              <div style={{ color: 'white'}}>Holders: <span className="text-pink-400" style={{ fontSize: 16, fontWeight: "bold"}}>{erc20Map[pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.id]?.holders.toLocaleString()}</span></div>
            </div>}
          </div>}
          {/* Thired Section */}
          <div className="flex flex-1 flex-col">
            <div className="flex">
              <div className={isMobile ? '' : 'flex-1 pt-2'}>
                <IOSSwitch checked={checked} onChange={toggleChecked} /><label style={{color: '#FFFFFF'}}>Active Pairs</label>
                <IOSSwitch checked={ismochi} onChange={toggleMochiMode} /><label style={{color: '#FFFFFF'}}>Mochi Pairs</label>
                {/* <Button
                    variant="contained"
                    startIcon={
                        <img
                            width={28}
                            src={MetaMask}
                            alt={MetaMask}
                        />
                    }
                    onClick={() => {
                        setOpenWalletList(true);
                    }}
                >
                    {account
                        ? `${account.substring(
                              0,
                              8
                          )} ... ${account.substring(
                              account.length - 4
                          )}`
                        : "Connect Wallet"}
                </Button> */}
              </div>
              {/* <div className="flex-1 text-right">
                <Button
                  className="py-2 px-4 dark:bg-gray-800 dark:text-white font-semibold rounded-lg shadow-lg bg-white text-gray-800"
                  onClick={switchTheme}
                  startIcon={<Brightness4Icon />}
                >
                  {isMobile ? 'D/L' : 'Dark/Light'}
                </Button>
              </div> */}
            </div>
          </div>
        </div>
        <div className={isMobile ? 'block mx-4' : "flex mx-8 mt-8 mb-1"}>
          <div className={isMobile ? "flex flex-col lg:w-2/3 md:w-full h-full" : "flex flex-col lg:w-2/3 md:w-full mr-2 h-full"}>
            {isMobile && <div className="flex flex-col lg:w-1/2 md:w-full mx-2 h-full">
              <div
                className="flex items-center appearance-none w-full py-2 px-4 my-1 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 dark:text-white cursor-pointer"
                id="searchArea"
              >
                <div
                  className="flex flex-1 mx-2 items-center justify-between"
                  onClick={onSearch}
                >
                  <div className="flex flex-row">
                    {pairlist?.length && <div style={{display: 'flex'}}>
                      <TokenIcon id={pairlist.filter(pair => pair.token0.id === row)[0]?.token0.id} style={{width: 26, height:26}} />
                      <TokenIcon id={pairlist.filter(pair => pair.token0.id === row)[0]?.token1.id} style={{width: 26, height:26, marginLeft: -25}} />
                    </div>}
                    <span className="mx-2">{pairlist.length && (pairlist.filter(pair => pair.token0.id === row)[0]?.token0?.symbol+'-USD')}</span>
                  </div>
                  {/* <span>${Number(pairlist.length && (pairlist.filter(pair => pair.token0.id === row)[0]?.reserve1 / pairlist.filter(pair => pair.token0.id === row)[0]?.reserve0 * onePrice)).toFixed(6).toLocaleString()}</span> */}
                </div>
              </div>
            </div>}
            <div className="flex flex-col w-full bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-non mt-6 dark:bg-gray-800 border-2 border-gray-200 dark:border-transparent">
              <div className="w-full p-4 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 h-full">
                <div className="text-red-400">
                  <h1 className="font-bold text-lg my-2">
                    <ShowChartIcon /> Price
                  </h1>
                </div>
              {/* {pairlist.length > 0 && <TradingViewWidget
                symbol={pairlist.filter(pair => pair.token0.id === row)[0].token1?.symbol.toUpperCase().replace('1', '')+pairlist.filter(pair => pair.token0.id === row)[0].token0?.symbol.toUpperCase().replace('1', '')}
                theme={theme === "dark" ? Themes.DARK : Themes.LIGHT}
                height={600}
                width={'100%'}
              />} */}
                {!ismochi && pairlist?.length && chartDatas?.price && <PriceChart data={chartDatas?.price} loading={loading} mode={theme} />}
                {ismochi && mochiPairs?.length && mochiChartData?.mochiprice && <PriceChart data={mochiChartData?.mochiprice} loading={loading} mode={theme} />}
              </div>
            </div>
            <div className="flex flex-col w-full bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-non mt-6 dark:bg-gray-800 border-2 border-gray-200 dark:border-transparent">
              <Grid container direction={ isMobile ? "column-reverse" : "row"}>
                <Grid item xs={12} sm={6}>
                  <div className="w-full p-4 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 h-full">
                    <div className="text-red-400">
                      <h1 className="font-bold text-lg my-2">
                        <ShowChartIcon /> Liquidity
                      </h1>
                    </div>
                    {!ismochi && pairlist?.length && chartDatas?.liquidity && <LiquidityChart data={chartDatas?.liquidity} loading={loading} mode={theme} />}
                    {ismochi && mochiPairs?.length && mochiChartData?.mochiliquidity && <LiquidityChart data={mochiChartData?.mochiliquidity} loading={loading} mode={theme} />}
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="w-full p-4 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 h-full">
                    <div className="text-red-400">
                      <h1 className="font-bold text-lg my-2">
                        <ShowChartIcon /> Market Caps
                      </h1>
                    </div>
                    {!ismochi && pairlist?.length && chartDatas?.marketcap && <MarketCapChart data={chartDatas?.marketcap} loading={loading} mode={theme} />}
                    {ismochi && mochiPairs?.length && mochiChartData?.mochimarketcap && <MarketCapChart data={mochiChartData?.mochimarketcap} loading={loading} mode={theme} />}
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="w-full mt-6 p-4 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 h-full">
              <div className="text-red-400">
                <h1 className="font-bold text-lg my-2">
                  <ShowChartIcon /> Trading Volume, 24h
                </h1>
                {/* <p>$ {totalVolume ? totalVolume.toLocaleString() : 'Loading...'}</p> */}
              </div>
              {!ismochi && pairlist?.length && chartDatas?.volume && <VolumeChart data={chartDatas?.volume} loading={loading} mode={theme} />}
              {ismochi && mochiPairs?.length && mochiChartData?.mochivolume && <VolumeChart data={mochiChartData?.mochivolume} loading={loading} mode={theme} />}
            </div>
            <div className="w-full mt-6 p-4 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-none dark:bg-gray-800 h-full">
              <div className="text-red-400">
                <h1 className="font-bold text-lg my-2">
                  <ShowChartIcon /> TxCount Chart
                </h1>
                {/* <p>$ {totalVolume ? totalVolume.toLocaleString() : 'Loading...'}</p> */}
              </div>
              {!ismochi && pairlist?.length && chartDatas?.txcount && <TxCountChart data={chartDatas?.txcount} loading={loading} mode={theme} />}
              {ismochi && mochiPairs?.length && mochiChartData?.mochitxcount && <TxCountChart data={mochiChartData?.mochitxcount} loading={loading} mode={theme} />}
            </div>
          </div>
        </div>
        <div className={isMobile ? "mt-4 mx-4 mb-8 mt-1 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-non p-4 dark:bg-gray-800" : "mx-8 mb-8 mt-1 bg-white text-gray-700 placeholder-gray-400 shadow-lg rounded-lg text-base focus:outline-non p-4 dark:bg-gray-800"}>
          <h1 className="text-pink-400 m-3 font-bold text-lg">
            <ImportContactsIcon /> Order Book
          </h1>
          <div className="m-2">
            {orderTab === "1" ? (
              <Button className="bg-pink-400 text-white rounded-md">
                Trade History
              </Button>
            ) : (
              <Button
                className="dark:text-white text-gray-800"
                onClick={() => onOrderTabClicked(1)}
              >
                Trade History
              </Button>
            )}
          </div>
          <div className="m-2">
            {/* {orderTab === 1 && <TransactionHistoryTable perPage={10} isMobile={isMobile} />} */}
            {orderTab === 1 && pairlist?.length && !ismochi && <Transactions id={pairlist.filter(pair => pair.token0.id === row)[0]?.id} mode={theme} /> }
            {orderTab === 1 && mochiPairs?.length && ismochi && <MochiTransactions transactions={mochitransactions} /> }
          </div>
        </div>
      </div>
      {/* <ConnectWallet
          isOpen={openWalletList}
          setIsOpen={setOpenWalletList}
      /> */}
      <Modal
        open={openSearchModal}
        onClose={SearchModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={{
            top: searchX,
            left: isMobile ? 0 : searchY,
            position: "absolute",
            width:  isMobile ? '96%' : searchWidth,
            height: 500,
            marginLeft: isMobile ? '2%' : 0,
            marginRight: isMobile ? 'auto' : 0,
          }}
          className="bg-white dark:bg-gray-800 border-1 border-purple-500 rounded-lg p-2 flex flex-col"
        >
          <div className="h-10 dark:bg-gray-600 rounded-lg flex align-middle bg-white">
            <SearchIcon className="m-2 dark:text-white text-gray-800" />
            <input
              className="dark:bg-gray-600 outline-none dark:text-white flex flex-1 m-2"
              placeholder="Search pair by ticker or token name"
              // onChange={(event) => {
              //   setValue(event)
              // }}
              onKeyUp={(event) => {
                setValue(event)
              }}
            />
          </div>
          <div className="w-full dark:text-white text-gray-500 px-2 overflow-y-auto">
            <table className="w-full">
              <thead
                style={{ position: "sticky", top: 0 }}
                className="dark:bg-gray-800 bg-white"
              >
                <tr>
                  <th className="text-left">Name</th>
                  {/* <th className="text-right">Volume 24h</th> */}
                  {/* <th className="text-right">Liquidity</th>
                  <th className="text-right">Price</th> */}
                </tr>
              </thead>
              <tbody>
              {ismochi && mochiPairs?.length == 0 ?
              <Spinner isLoading={true} /> :
                pairlist?.length
                && pairlist.map((pair, i) => (
                    <tr key={i}>
                      <td className="flex flex-row items-center my-2"  onClick={() => selectRow(pair?.token0?.id)}>
                        <div style={{display: 'flex'}}>
                          <TokenIcon id={pair.token0.id} />
                          <TokenIcon id={pair.token1.id} style={{marginLeft: -25}} />
                        </div>
                        <span className="mx-2">{pair.token0?.symbol+'-USD'}</span>
                      </td>
                      {/* <td  onClick={() => selectRow(i)} className="text-right">${Number(pair?.dayData[0]?.volumeUSD ? pair?.dayData[0]?.volumeUSD : 0).toFixed(8).toLocaleString()}</td> */}
                      {/* <td  onClick={() => selectRow(pair?.token0?.id)} className="text-right">${Number(pair.reserveUSD ? pair.reserveUSD : 0).toFixed(2).toLocaleString()}</td>
                      <td  onClick={() => selectRow(pair?.token0?.id)} className="text-right text-red-400">${Number(pair?.reserve1 / pair?.reserve0 * onePrice ? pair?.reserve1 / pair?.reserve0 * onePrice : 0).toFixed(8).toLocaleString()}</td> */}
                    </tr>
                  ))
              }
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;
