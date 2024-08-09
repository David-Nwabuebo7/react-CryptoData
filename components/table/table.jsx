import { Table, Button, Image, Alert } from "react-bootstrap";
import "./table.css";
import { useEffect, useState } from "react";
import axois from "axios";
import plus from "./plus.png";

import {BsFillCaretDownFill} from 'react-icons/bs'
export default function Tabler() {
  const [inputdata, SetData] = useState("");

  const [cryptodata, Setcryptodata] = useState([]);

  const [loading, SetLoading] = useState(false);

  const [error, SetError] = useState(null);

  const [newData, setNewdata] = useState([]);

  const [defaultData, SetDefaultData] = useState([]);

  const [newCryptoState, setNewState] = useState(false);
  const [dropDown , SEtDropDown] = useState([])
const [apiSitution,SetSituation]= useState(null)


  // input data handling
  const grabData = (e) => {
    const { value } = e.target;
    SetData(value);

    const dropData = value && cryptodata.filter((item)=>{
      const loweredName = item.name.toLowerCase();
      const loweredSearchTerm = value.toLowerCase();
     const data = loweredName.includes(loweredSearchTerm)
        return data
    })
    SEtDropDown(dropData)
  };

  // api fetch, make update when data changes
  useEffect(() => {
    const fetchData = async () => {
     
      try {
        SetLoading(true);
        const response = await axois.get(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=03056ea4-1442-43da-8c51-6e6d491c2cb8`
        );
          Setcryptodata(response.data ? response.data.data : [])
      } catch (error) {
        SetError( error.response.data.status.notice);
        console.error("Error fetching data:", error);
       
      } finally {
        SetLoading(false);
      }
    };

    // Update data
    const intervalId = setInterval(fetchData, 3000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [cryptodata]);// add the cryptodata

  // fetches three default cryptodata(orignalCrypto)
  const findDefaultCrypto = () => {
    const originalCrypto = ["bitcoin", "ethereum", "tether usdt"];
    // this fetches all objects with the names of the origonalCrypto array of the cryptodata array
    let searched1 =
      cryptodata &&
      cryptodata.filter((item) =>
        originalCrypto.includes(item.name.toLowerCase())
      );

    SetDefaultData(searched1);
  };

  useEffect(() => {
    findDefaultCrypto();
  }, [defaultData]); // try to remove the defaultdata

  // add new searched crypto data
  const findNewCrypto = (searchTerm) => {
    let searched =
      cryptodata &&
      cryptodata.filter((item) => {
        const loweredName = item.name.toLowerCase();
        const loweredSearchTerm = searchTerm.toLowerCase();

        

        let newCrypto = loweredName === loweredSearchTerm
        if (newCrypto) {
          SetData("");
          setNewState(true)
          console.log("i found something");
          return newCrypto;
        }else if(!newCrypto){
          setNewState(false)
        }
      });

    setNewdata((prev) => {
      return [...new Set([...prev, ...searched])]; // merges the two array without repetition
    });
  };







  // add new crypto data
  function AddData() {
   let updates = setInterval(findNewCrypto(inputdata),3000)
   return ()=> clearInterval(updates)
  }

  // for the percentages
  function handlePercent(percentage) {
    if (percentage < 0) {
      let RemovedNegative = Math.abs(percentage);
      return  RemovedNegative.toFixed(2) + "%";
    } else {
      return percentage.toFixed(2) + "%";
    }
  }

  // convert nuber to semi written
  function numberWithCommasAndSuffix(number) {
    // Define thresholds for unit conversion
    const thresholds = {
      T: 1e12, // Trillon
      B: 1e9, // Billions
      M: 1e6, // Millions
      k: 1e3, // Thousands
    };

    // Find the appropriate unit suffix
    let unit = "";
    for (const suffix in thresholds) {
      if (Math.abs(number) >= thresholds[suffix]) {
        number /= thresholds[suffix];
        unit = suffix;
        break;
      }
    }

    // Format the number with one decimal place and add the unit suffix
    return number.toFixed(2) + unit;
  }



 

  // each row of the cryptodata
  const Row =
    newData &&
    newData.map((item) => {
      const { symbol, total_supply, cmc_rank, circulating_supply } = item;
      const {
        price,
        volume_24h,
        market_cap,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
        percent_change_30d,
      } = item.quote.USD;
      function HandlePercentColor(percentage) {
        let styleColor = { color: percentage < 0 ? "red" : "green" };
        return styleColor;
      }
      return (
        <>
          <tr key={cmc_rank}>
            <td>{cmc_rank}</td>
            <td>{symbol}</td>
            <td>${market_cap.toLocaleString()}</td>
            <td>${price.toFixed(2)}</td>
            <td>{numberWithCommasAndSuffix(total_supply)}</td>
            <td>${volume_24h.toLocaleString()}</td>
            <td>{circulating_supply.toLocaleString()}</td>
            <td>
              <span style={HandlePercentColor(percent_change_1h)}>
                {handlePercent(percent_change_1h)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_24h)}>
                {handlePercent(percent_change_24h)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_7d)}>
                {handlePercent(percent_change_7d)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_30d)}>
                {  handlePercent(percent_change_30d)}
              </span>
            </td>
          </tr>
        </>
      );
    });

  // each row of the defaultData
  const defaultRow =
    defaultData &&
    defaultData.map((item) => {
      const { symbol, total_supply, cmc_rank, circulating_supply } = item;
      const {
        price,
        volume_24h,
        market_cap,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
        percent_change_30d,
      } = item.quote.USD;

      function HandlePercentColor(percentage) {
        let style = { color: percentage < 0 ? "red" : "green" };
        return style;
      }
      return (
        <>
          <tr key={cmc_rank}>
            <td>{cmc_rank}</td>
            <td>{symbol}</td>
            <td>${market_cap.toLocaleString()}</td>
            <td>${price.toFixed(2)}</td>
            <td>{numberWithCommasAndSuffix(total_supply)}</td>
            <td>${volume_24h.toLocaleString()}</td>
            <td>{circulating_supply.toLocaleString()}</td>
            <td>
              <span style={HandlePercentColor(percent_change_1h)}>
                {handlePercent(percent_change_1h)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_24h)}>
                {handlePercent(percent_change_24h)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_7d)}>
                {handlePercent(percent_change_7d)}
              </span>
            </td>
            <td>
              <span style={HandlePercentColor(percent_change_30d)}>
                {handlePercent(percent_change_30d)}
              </span>
            </td>
          </tr>
        </>
      );
    });


  function FormHandle(e) {
    e.preventDefault();
    AddData();
  }

  return (
    <>
      <form onSubmit={FormHandle} action="#">
        <div className="search mt-5 ">
          <input
            type="text"
            placeholder="Search..."
            onChange={grabData}
            id="crypto"
            name="data"
            value={inputdata}
          />
          <span>
            <Button onClick={AddData}>
              <Image src={plus} className="button" />
            </Button>
          </span>
        </div>
     
      </form>

      {defaultData.length ? (
        <div className="Table-Container">
          <Table striped bordered hover className="mt-5 table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Symbol</th>
                <th>MarketCap</th>
                <th>Price</th>
                <th>Total supply</th>
                <th>volume (24hrs)</th>
                <th>circulating volume</th>
                <th style={{ textTransform: "lowercase" }}>1h</th>
                <th style={{ textTransform: "lowercase" }}>24h</th>
                <th style={{ textTransform: "lowercase" }}>7d</th>
                <th style={{ textTransform: "lowercase" }}>30d</th>
              </tr>
            </thead>
            <tbody>
              {defaultRow}
              {Row}
            </tbody>
          </Table>
        </div>
      ) : loading ? (
        <h3 className="loading"> Loading Data... </h3>
      ) : error?  (
        <h5 className="error">{error}!!!</h5>
      ): <h4 className="wait"> please wait...</h4>}
    </>
  );
}
// add the new api  data without refresh
// 5:30 of the video should help you with the api problems,    React JavaScript Framework for Beginners – Project-Based Course_HIGH