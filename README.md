# CoinSpot Async API

## Introduction

An API for CoinSpot that uses promises and ES6 classes to communicate with
CoinSpot.

## How To Use

```javascript
const coinspot = require("coinspot-async-api");

const client = coinspot(API_KEY_1, API_SECRET_1);
const client_1 = coinspot(API_KEY_2, API_SECRET_2);

client.balances().then(data => {
	console.log(data);
});

client.buy("BTC", 1, 20000).then(data => {
	console.log(data);
});
```

## API

### `marketrates`

Method returns the current buy/sell price that coinspot will trade coins at.

Calling the method with no value returns all the coin prices.

```javascript
client.marketrates().then(data => {
	console.log(data);
});

// Returns all the current market prices
```

Calling the method with a single parameter returns that coins market price.

```javascript
client.marketrates("BTC").then(data => {
	console.log(data);
});

// { "BTC" : { buy: 20000.00, sell: 20000.00 } }
```

Calling the method with an array of coins will return the prices for all the
selected coins.

```javascript
client.marketrates(["BTC", "ETH"]).then(data => {
	console.log(data);
});

// { "BTC" : { buy: 20000.00, sell: 20000.00 },
//   "ETH" : { buy: 20000.00, sell: 20000.00 } }
```

## Supported Endpoins

| Function      | Endpoint               |
| ------------- | ---------------------- |
| `sendcoin`    | "/api/my/coin/send"    |
| `coindeposit` | "/api/my/coin/deposit" |
| `quotebuy`    | "/api/quote/buy"       |
| `quotesell`   | "/api/quote/sell"      |
| `balances`    | "/api/my/balances"     |
| `orders`      | "/api/orders"          |
| `myorders`    | "/api/my/orders"       |
| `spot`        | "/api/spot"            |
| `buy`         | "/api/my/buy"          |
| `sell`        | "/api/my/sell"         |

## Contributing

Feel free to open issues and send in those PRs. Thanks!
