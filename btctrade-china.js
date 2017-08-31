const util = require('util');
const request = require('request');
const VError = require('verror');
const _ = require('underscore');
const crypto = require('crypto');

var Btctrade = function Btctrade(key, secret, timeout) {
    this.key = key;
    this.secret = secret;
    this.server = 'https://api.btctrade.com/api/';
    this.timeout = timeout || 30000;
}

function http_build_query(params) {
    let str = '';
    for (let p in params)
        str += p + '=' + params[p]+'&';
    str += 'version=2';

    return str;
}

Btctrade.prototype.privateRequest = function(type, params, callback) {
    const functionName = 'Btctrade.privateRequest()';

    if(!this.key || !this.secret) {
        var error = new VError('%s must provide key and secret to make this API request.', functionName);
        return callback(error);
    }

    if(!_.isObject(params)) {
        var error = new VError('%s second parameter %s must be an object. If no params then pass an empty object {}', functionName, params);
        return callback(error);
    }

    if (!callback || typeof(callback) != 'function') {
        var error = new VError('%s third parameter needs to be a callback function', functionName);
        return callback(error);
    }

    const n = require('nonce')();
    const nonce = n();

    // add key and nonce params
    params = _.extend({key: this.key, nonce: nonce}, params);
    let str = http_build_query(params);
    
    // md5(secret)
    const md5 = crypto.createHash('md5');
    const md5secret = md5.update(this.secret).digest("hex");

    // sign it
    const signer = crypto.createHmac('sha256', md5secret);
    const signature = signer.update(str).digest('hex');
    
    // add signature param
    params = _.extend({signature: signature}, params);
    str = http_build_query(params)
    
    var headers = {
        "User-Agent": "Btctrade Javascript API Client",
        "Content-Type" : "application/x-www-form-urlencoded"
    };

    var options = {
        url: this.server + type,
        method: 'POST',
        headers: headers,
        body: str
    };

    var requestDesc = util.format('%s request to url %s with params %s',
        options.method, options.url, JSON.stringify(params));

    sendRequest(options, requestDesc, callback);
}

Btctrade.prototype.publicRequest = function(type, params, callback) {
    const functionName = 'Btctrade.publicRequest()';
    
        if(!_.isObject(params)) {
            var error = new VError('%s second parameter %s must be an object. If no params then pass an empty object {}', functionName, params);
            return callback(error);
        }
    
        if (!callback || typeof(callback) != 'function') {
            var error = new VError('%s third parameter needs to be a callback function with err and data parameters', functionName);
            return callback(error);
        }
    
        const headers = {"User-Agent": "Btctrade Javascript API Client"};

        const options = {
            url: this.server + type,
            method: 'GET',
            headers: headers,
            timeout: this.timeout,
            qs: params,
            json: {}        // request will parse the json response into an object
        };
    
        var requestDesc = util.format('%s request to url %s with parameters %s',
            options.method, options.url, JSON.stringify(params));
    
        sendRequest(options, requestDesc, callback);
}

function sendRequest(options, requestDesc, callback) {
    var functionName = 'Btctrade.sendRequest()';

    request(options, function(err, response, data) {
        var error = null;   // default to no errors

        if(err) {
            error = new VError(err, '%s failed %s', functionName, requestDesc);
            error.name = err.code;
        }
        else if (response.statusCode < 200 || response.statusCode >= 300) {
            error = new VError('%s HTTP status code %s returned from %s. Status message: %s', functionName,
                response.statusCode, requestDesc, response.statusMessage);
            error.name = response.statusCode;
        }
        // if request was not able to parse json response into an object
        // else if (!_.isObject(data) )
        // {
        //     error = new VError('%s could not parse response from %s\n. HTTP status code %s. Response: %s', functionName, requestDesc, response.statusCode, data);
        //     error.name = data;
        // }
        else if (_.has(data, 'error')) {
            error = new VError('%s API returned error code %s from %s\nError message: %s', functionName,
                data.error.code, requestDesc, data.error.message);
            error.name = data.error.message;
        }

        callback(error, data);
    });
}

//
// Public Functions
//
// @coin: type ['btc','eth','etc','ltc','doge','ybc']
Btctrade.prototype.getTicker = function(coin, callback) {
    this.publicRequest('ticker', {coin: coin}, callback);
}

Btctrade.prototype.getDepth = function(coin, callback) {
    this.publicRequest('depth', {coin: coin}, callback);
}

// @since: from specific tid, return 50 items (0: default recently)
Btctrade.prototype.getTrades = function(coin, sinceTid, callback) {
    this.publicRequest('trades', {coin: coin, since: sinceTid}, callback);
}

//
// Private Functions
//
Btctrade.prototype.buyOrder = function(coin, amount, price, callback) {
    this.privateRequest('buy', {coin: coin, amount: amount, price: price}, callback);
}

Btctrade.prototype.sellOrder = function(coin, amount, price, callback) {
    this.privateRequest('sell', {coin: coin, amount: amount, price: price}, callback);
}

Btctrade.prototype.getBalance = function(callback) {
    this.privateRequest('balance', {}, callback);  
}

Btctrade.prototype.cancelOrderById = function(id, callback) {
    this.privateRequest('cancel_order', {id: id}, callback);
}

Btctrade.prototype.fetchOrderById = function(id, callback) {
    this.privateRequest('fetch_order', {id: id}, callback);
}

Btctrade.prototype.fetchOrders = function(coin, ordertype, since, ob, callback) {
    this.privateRequest('orders', {coin: coin, type: ordertype, since: since, ob: ob}, callback);
}

module.exports = Btctrade;