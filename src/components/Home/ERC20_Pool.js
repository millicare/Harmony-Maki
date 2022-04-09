import ReactApexChart, { useEffect } from "react";
import { getAllERC20 } from "../../client"
import { setERC20Pool } from "../../hooks/ERC20_Pool";

export function ERC20_Pool() {
    useEffect(() => {
        const func = async () => {
            const erc20 = await getAllERC20();
            console.log(erc20, "=====================asassadf")
            const erc20Map = {};
            erc20.forEach((i) => {
                erc20Map[i.address] = i;
            });
    
            window.localStorage.setItem("ERC20_Pool", JSON.stringify(erc20Map));
            setERC20Pool(erc20Map);
        }
        func();
    }, [])
    useEffect(() => {
      let tId = 0;
        console.log("qweqweqwe==========")
      const getRates = async () => {
        try {
          const erc20 = await getAllERC20();
          console.log(erc20, "=====================asassadf")
          const erc20Map = {};
          erc20.forEach((i) => {
            erc20Map[i.address] = i;
          });
  
          window.localStorage.setItem("ERC20_Pool", JSON.stringify(erc20Map));
          setERC20Pool(erc20Map);
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
    }, []);
  
    return null;
  }