require("whatwg-fetch");

const crypto = require("crypto");
const hmac = crypto.createHmac;

var request = function(path, postdata) {
	const root_url = "https://www.coinspot.com.au";
	let nonce = new Date().getTime();

	postdata = postdata || {};
	postdata.nonce = nonce;

	let stringmessage = JSON.stringify(postdata);
	let signedMessage = new hmac("sha512", self.secret);

	signedMessage.update(stringmessage);

	let sign = signedMessage.digest("hex");

	return fetch(`${root_url}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			sign: sign,
			key: self.key
		}
	});
};

class coinspot {
	constructor(key, secret) {
		this.key = key;
		this.secret = secret;
	}

	sendcoin(cointype, amount, address) {
		return request("/api/my/coin/send", {
			cointype: cointype,
			amount: amount,
			address: address
		});
	}

	coindeposit(cointype) {
		return request("/api/my/coin/deposit", { cointype: cointype });
	}

	quotebuy(cointype, amount) {
		return request("/api/quote/buy", {
			cointype: cointype,
			amount: amount
		});
	}

	quotesell(cointype, amount) {
		return request("/api/quote/sell", {
			cointype: cointype,
			amount: amount
		});
	}

	balances() {
		return request("/api/my/balances", {});
	}

	orders(cointype) {
		return request("/api/orders", { cointype: cointype });
	}

	myorders() {
		return request("/api/my/orders", {});
	}

	spot() {
		return request("/api/spot", {});
	}

	buy(cointype, amount, rate) {
		let data = { cointype: cointype, amount: amount, rate: rate };
		return request("/api/my/buy", data);
	}

	sell(cointype, amount, rate) {
		let data = { cointype: cointype, amount: amount, rate: rate };
		return request("/api/my/sell", data);
	}
}

module.exports = (key, secret) => {
	return new coinspot(key, secret);
};
