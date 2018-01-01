require("isomorphic-fetch");

const crypto = require("crypto");
const cheerio = require("cheerio");
const hmac = crypto.createHmac;
const root_url = "https://www.coinspot.com.au";

const request = (endpoint, postdata, key, secret) => {
	let nonce = new Date().getTime();

	postdata = postdata || {};
	postdata.nonce = nonce;

	let stringmessage = JSON.stringify(postdata);
	let signedMessage = new hmac("sha512", secret);

	signedMessage.update(stringmessage);

	let sign = signedMessage.digest("hex");

	return fetch(`${root_url}${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			sign: sign,
			key: key
		},
		body: JSON.stringify({ nonce })
	});
};

class coinspot {
	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
	}

	prices() {
		return fetch(`${root_url}/pubapi/latest`);
	}

	async marketrates(coins) {
		const page_html = await fetch(`${root_url}/tradecoins`).then(res =>
			res.text()
		);
		const coinDOM = cheerio.load(page_html);
		const getCoinRate = coin => {
			const buySellPrice = coinDOM(`li[data-coin=${coin}]`)
				.children()
				.children()
				.slice(1, 3);
			return {
				buy: parseFloat(
					buySellPrice
						.eq(0)
						.text()
						.slice(1)
				),
				sell: parseFloat(
					buySellPrice
						.eq(1)
						.text()
						.slice(1)
				)
			};
		};
		const getAllCoins = () => {
			const c = [];
			const allCoins = coinDOM("ul[class=listgroup]")
				.children()
				.slice(2, -1);
			for (let i = 0; i < allCoins.length; i = i + 2) {
				c.push(allCoins.eq(i).attr("data-coin"));
			}
			return c;
		};
		const rates = {};
		if (typeof coins === "string") {
			coins = [coins];
		} else if (coins === undefined || coins.length === 0) {
			coins = getAllCoins();
		}
		coins.forEach(coin => {
			if (typeof coin === "string") {
				rates[coin] = getCoinRate(coin);
			}
		});
		return rates;
	}

	sendcoin(cointype, amount, address) {
		return request(
			"/api/my/coin/send",
			{
				cointype: cointype,
				amount: amount,
				address: address
			},
			this.key,
			this.secret
		);
	}

	coindeposit(cointype) {
		return request(
			"/api/my/coin/deposit",
			{ cointype: cointype },
			this.key,
			this.secret
		);
	}

	quotebuy(cointype, amount) {
		return request(
			"/api/quote/buy",
			{
				cointype: cointype,
				amount: amount
			},
			this.key,
			this.secret
		);
	}

	quotesell(cointype, amount) {
		return request(
			"/api/quote/sell",
			{
				cointype: cointype,
				amount: amount
			},
			this.key,
			this.secret
		);
	}

	balances() {
		return request("/api/my/balances", {}, this.key, this.secret);
	}

	orders(cointype) {
		return request(
			"/api/orders",
			{ cointype: cointype },
			this.key,
			this.secret
		);
	}

	myorders() {
		return request("/api/my/orders", {}, this.key, this.secret);
	}

	spot() {
		return request("/api/spot", {}, this.key, this.secret);
	}

	buy(cointype, amount, rate) {
		let data = { cointype: cointype, amount: amount, rate: rate };
		return request("/api/my/buy", data, this.key, this.secret);
	}

	sell(cointype, amount, rate) {
		let data = { cointype: cointype, amount: amount, rate: rate };
		return request("/api/my/sell", data, this.key, this.secret);
	}

	cancelbuy(buyId) {
		let data = { id: buyId };
		return request("/my/buy/cancel", data, this.key, this.secret);
	}

	cancelsell(sellId) {
		let data = { id: sellId };
		return request("/my/sell/cancel", data, this.key, this.secret);
	}
}

module.exports = (key, secret) => {
	return new coinspot(key, secret);
};
