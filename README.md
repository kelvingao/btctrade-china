# Btctrade

    npm install btctrade-china

A basic API wrapper for the [Btctrade REST API](https://www.btctrade.com/api.help.html). Please refer to [their documentation](https://www.btctrade.com/api.help.html) for all calls explained. Check out `example.js` for a list of all possible calls and their parameters.

```javascript
var Btctrade = require('btctrade-china');
var btctrade = new Btctrade();

btctrade.getTrades('btc', 0, function(err, trades) {
  console.log(trades);
});
```


# License

The MIT License (MIT)

Copyright (c) 2017 Kelvin Gao <89156201@qq.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.