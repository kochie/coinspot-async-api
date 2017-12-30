require("isomorphic-fetch");

const crypto = require("crypto");
const hmac = crypto.createHmac;

const request = (endpoint, postdata, key, secret) => {
	const root_url = "https://www.coinspot.com.au";
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
		return request("/pubapi/latest", {}, this.key, this.secret);
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
