# shortsqueeze

> [!WARNING]
> This API is deprecated since shortsqueeze.com has removed all free data from their website.

[![GitHub](https://img.shields.io/github/followers/samgozman?label=Follow&style=social)](

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-donate-yellow.svg)](https://ko-fi.com/C0C1DI4VL)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C1DI4VL)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/samgozman/shortsqueeze/Shortsqueeze%20Node.js)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/121fb2f4f8994d78b11271510f207b99)](https://www.codacy.com/gh/samgozman/shortsqueeze/dashboard?utm_source=github.com&utm_medium=referral&utm_content=samgozman/shortsqueeze&utm_campaign=Badge_Grade)
[![npm](https://img.shields.io/npm/v/shortsqueeze)](https://www.npmjs.com/package/shortsqueeze)
![npm bundle size](https://img.shields.io/bundlephobia/min/shortsqueeze)
![NPM](https://img.shields.io/npm/l/shortsqueeze)

Get detailed short stocks data from shortsqueeze.com

> _Warning! This is unofficial API._
> 💎🙌 to the moon 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

## Installation

Install package from NPM

```bash
npm install shortsqueeze
```

## Features

Get free stock shorts data from shortsqueeze.com such as:

- Short intrest days to cover
- Short percent float
- Short % Increase / Decrease
- Short interest shares short
- Trading volume today vs Avg
- Market cap
- Current price (20 min delay)
- **AND MANY OTHERS**

## Usage

Use **shortsqueeze** in async functions

```javascript
const shortsqueeze = require('shortsqueeze');

const main = async () => {
  const stock = await shortsqueeze('SPCE');
  console.log(stock);
};

main();
```

### Returns

> await shortsqueeze('SPCE')

```javascript
{
  shortInterestRatioDaysToCover: 1.1,
  shortPercentOfFloat: 10.12,
  shortPercentIncreaseDecrease: -45,
  shortInterestCurrentSharesShort: 21130000,
  sharesFloat: 208790000,
  shortInterestPriorSharesShort: 38600000,
  percentFrom52WkHigh: -5.4,
  percentFrom50DayMa: 74.66,
  percentFrom200DayMa: 162.11,
  percentFrom52WkLow: 555.74,
  n52WeekPerformance: 148.91,
  tradingVolumeTodayVsAvg: 108.18,
  tradingVolumeToday: 21387935,
  tradingVolumeAverage: 19770000,
  marketCap: NaN,
  percentOwnedByInsiders: 40,
  percentOwnedByInstitutions: 29.72,
  price: 54.53,
  name: 'Virgin Galactic Holdings Inc',
  ticker: 'SPCE'
}
```
