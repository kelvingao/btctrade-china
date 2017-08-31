const Btctrade = require('./btctrade-china');

// Test public data APIs
var publicBtctrade = new Btctrade();
//publicBtctrade.getTicker('btc', console.log);
//publicBtctrade.getTrades('btc', 0, console.log);
//publicBtctrade.getDepth('btc', console.log);


// // Test private data APIs
const key = 'your-key';
const secret = 'your-secret';

var privateBtctrade = new Btctrade(key, secret);

//privateBtctrade.getBalance(console.log);
//privateBtctrade.buyOrder('eth', 0.01, 2320, console.log);
//privateBtctrade.sellOrder('btc', 0.01, 30200, console.log);
//privateBtctrade.fetchOrderById(383780251,console.log);
//privateBtctrade.fetchOrders('eth', 'all', 1504179201, 'DESC', console.log);
//privateBtctrade.fetchOrders('eth', 'open', 1504179201, 'ASC', console.log);