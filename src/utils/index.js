import React from 'react'
import dayjs from 'dayjs'
import Numeral from 'numeral'

export const formatTime = (unix) => {
    const now = dayjs()
    const timestamp = dayjs.unix(unix)
  
    const inSeconds = now.diff(timestamp, 'second')
    const inMinutes = now.diff(timestamp, 'minute')
    const inHours = now.diff(timestamp, 'hour')
    const inDays = now.diff(timestamp, 'day')
  
    if (inHours >= 24) {
      return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`
    } else if (inMinutes >= 60) {
      return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`
    } else if (inSeconds >= 60) {
      return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`
    } else {
      return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`
    }
}

const toK = (num) => {
    return Numeral(num).format('0.[00]a')
}

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
    if (isNaN(number) || number === '' || number === undefined) {
      return usd ? '$0' : 0
    }
    let num = parseFloat(number)
  
    if (num > 500000000) {
      return (usd ? '$' : '') + toK(num.toFixed(0), true)
    }
  
    if (num === 0) {
      if (usd) {
        return '$0'
      }
      return 0
    }
  
    if (num < 0.0001 && num > 0) {
      // return usd ? '< $0.0001' : '< 0.0001'
    }
  
    if (num > 1000) {
      return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num).toFixed(0)).toLocaleString()
    }
  
    if (usd) {
      if (num < 0.1) {
        return formatDollarAmount(num, 10)
      } else {
        return formatDollarAmount(num, 2)
      }
    }
  
    return Number(parseFloat(num).toFixed(5)).toLocaleString()
}

export const formatDollarAmount = (num, digits) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    return formatter.format(num)
}

export const urls = {
    showTransaction: (tx) => `https://explorer.harmony.one/#/tx/${tx}/`,
    showAddress: (address) => `https://explorer.harmony.one/#/address/${address}/`,
    showToken: (address) => `https://explorer.harmony.one/#/token/${address}/`,
    showBlock: (block) => `https://explorer.harmony.one/#/block/${block}/`,
}

const TOKEN_OVERRIDES = {
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c': {
      name: 'BNB (Wrapped)',
      symbol: 'BNB',
    },
    '0x1416946162b1c2c871a73b07e932d2fb6c932069': {
      name: 'Energi',
      symbol: 'NRGE',
    },
}
  
// override tokens with incorrect symbol or names
export function updateNameData(data) {
    if (data?.token0?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token0.id)) {
      data.token0.name = TOKEN_OVERRIDES[data.token0.id].name
      data.token0.symbol = TOKEN_OVERRIDES[data.token0.id].symbol
    }
  
    if (data?.token1?.id && Object.keys(TOKEN_OVERRIDES).includes(data.token1.id)) {
      data.token1.name = TOKEN_OVERRIDES[data.token1.id].name
      data.token1.symbol = TOKEN_OVERRIDES[data.token1.id].symbol
    }
  
    return data
}
