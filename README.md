# Hanzi Writer Data

## Demo

View a live-demo of this data at[https://chanind.github.io/hanzi-writer-data](chanind.github.io/hanzi-writer-data)

## About

This is the character data used by [Hanzi Writer](https://github.com/chanind/hanzi-writer). This data was originally contained in the Hanzi Writer repo, but was moved out for several reasons:

- This data is licensed separately from the Hanzi Writer source code.
- This allows users who wish to import character data in NPM to do so without forcing everyone to download the character data along with Hanzi Writer. 
- Publishing on NPM makes this data available on the [jsdelivr CDN](https://www.jsdelivr.com/package/npm/hanzi-writer-data), so data can be loaded via, for instance, https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/我.json. 

Check out [https://chanind.github.io/hanzi-writer](chanind.github.io/hanzi-writer) for more info about Hanzi Writer.

## Usage

By default Hanzi Writer will automatically load this character data from the jsdelivr CDN when needed, so most users don't need to worry about loading this data explicity. However, loading this data explicitly can allow Hanzi Writer to work offline which is great for mobile apps. Also, if you know in advance which characters Hanzi Writer should display you can preload the data and avoid needing to make a web request at all, which is a nice speed boost. The easiest way to load Hanzi Writer character data is via npm:

```
npm install hanzi-writer-data
```

Then, you can require character data in JS just like you would any other JS module:

```js
const wo = require('hanzi-writer-data/我');
```

You can then pass this data into Hanzi Writer via the `charDataLoader` option, like below:

```
const HanziWriter = require('hanzi-writer');
const woData = require('hanzi-writer-data/我');

var writer = new HanziWriter('target', '我', {
  charDataLoader: function(char) {
    return woData;
  }  
});  

```

## License

This data comes from the [Make Me A Hanzi](https://github.com/skishore/makemeahanzi) project, which extracted the data from fonts by [Arphic Technology](http://www.arphic.com/), a Taiwanese font forge that released their work under a permissive license in 1999. You can redistribute and/or modify this data under the terms of the Arphic Public License as published by Arphic Technology Co., Ltd. A copy of this license can be found in [ARPHICPL.TXT](https://raw.githubusercontent.com/chanind/hanzi-writer-data/master/ARPHICPL.TXT).
