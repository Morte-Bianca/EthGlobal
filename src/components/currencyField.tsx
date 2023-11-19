import React from 'react'

const CurrencyField = (props:any) => {
  const getPrice = (value:any) => {
    props.getSwapPrice(value)
  }

  return (
    <div className="row currencyInput  transition-all bg-[#272733] text-white !rounded-xl w-11/12 ">
      <div className="col-md-6 numberContainer ">
        {props.loading ? (
          <div className="spinnerContainer ">
            <props.spinner />
          </div>
        ) : (
          <input
            className="currencyInputField bg-transparent  outline-none h-full flex items-start"
            autoFocus
            placeholder="0.0"
            value={props.value}
            onBlur={e => (props.field === 'input' ? getPrice((e.target.value).replace(',','.')) : null)}
          />
        )}
      </div>
      <div className="col-md-6 tokenContainer">
        <span className="tokenName">{props.tokenName}</span>
        <div className="balanceContainer">
          <span className="balanceAmount">Balance: {props.balance?.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyField