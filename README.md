# CoinSpot Async API

## Introduction

An API for CoinSpot that uses promises and ES6 classes to communicate with CoinSpot.

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

Feel free to open issues and send in those PRs.
Thanks!
