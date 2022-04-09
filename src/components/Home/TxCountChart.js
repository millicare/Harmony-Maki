import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Spinner from "../Spinner";

export const TxCountChart = ({data, loading, mode}) => {
  const [isLoading, setLoading] = useState(false);
  
  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      align: 'left',
      style: {
        color: mode === 'dark' ? 'white' : 'black'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
          style: {
            colors: mode === 'dark' ? 'white' : 'black'
          }
      },
    },
    yaxis: {
        labels: {
            style: {
              colors: mode === 'dark' ? 'white' : 'black'
            }
        },
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100]
      }
    },
  }
 
  let series = [{
      name: "Tx Count",
      data: data
    }]

  useEffect(() => {
    setLoading(loading);
  }, [loading])

  return (
    <>
      <Spinner isLoading={isLoading} />
      <div id="chart">
          <Chart options={options} series={series} type="area" height={400} />
      </div>
    </>
  );
}