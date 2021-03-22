import React, {useState, useEffect} from 'react';
import './style.css'
import Currency from './Currency'

function App() {

  const base_URL = "https://api.exchangeratesapi.io/latest"
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState() //set state for default currency in the first box
  const [toCurrency, setToCurrency] = useState() // def state for second box
  const [exchangeRate, setExchangeRate] = useState() // by def, val for exchange rate would be null
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    toAmount = amount * exchangeRate
    fromAmount = amount
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(base_URL)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0] // def to first val of currency in list when data rates load
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(() => {
    if (toCurrency != null && fromCurrency != null) {
      fetch(`${base_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }


  return (
    <div className="App">
      <h1>Welcome to My Currency Converter!!!</h1>
      {/* MOVE TO THE HEADER OF PAGE */}
      <h1>Convert</h1>
      <Currency 
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={evt => setFromCurrency(evt.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}

      />
      <div className="equals">=</div>
      <Currency 
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={evt => setToCurrency(evt.target.value)}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </div>
  );
}

export default App;
