![GitHub Workflow Status](https://img.shields.io/github/workflow/status/samgozman/shortsqueeze/Shortsqueeze%20Node.js) 
[![npm](https://img.shields.io/npm/v/shortsqueeze)](https://www.npmjs.com/package/shortsqueeze)
![npm bundle size](https://img.shields.io/bundlephobia/min/shortsqueeze)
![NPM](https://img.shields.io/npm/l/shortsqueeze)

# shortsqueeze

Get detailed short stocks data from shortsqueeze.com

> *Warning! This is unofficial API.*

> 💎🙌 to the moon 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

## Installation
Install package from NPM

```
npm install shortsqueeze
```

## Features
Get free stock shorts data from shortsqueeze.com such as: 

* Short intrest days to cover
* Short percent float
* Short % Increase / Decrease
* Short interest shares short
* Trading volume today vs Avg
* Market cap
* Current price (20 min delay)
* **AND MANY OTHERS**

## Usage
Use **shortsqueeze** in async functions

```javascript
const shortsqueeze = require('shortsqueeze')

const main = async () => {
	const stock = await shortsqueeze('SPCE')
	console.log(stock)
}

main()
```
### Returns
> await shortsqueeze('SPCE')

```javascript
{
  shortInterestRatioDaysToCover: 2.3,
  shortPercentOfFloat: 71.95,
  shortPercentIncreaseDecrease: -12,
  shortInterestSharesShort: 38600000,
  shortInterestSharesShortPrior: 43740000,
  percentFrom52WkHigh: -25.48,
  percentFrom50DayMa: 54.75,
  percentFrom200DayMa: 110.71,
  percentFrom52WkLow: 388.85,
  n52WeekPerformance: 151.93,
  tradingVolumeTodayVsAvg: 168.8,
  tradingVolumeToday: 28443498,
  tradingVolumeAverage: 16850000,
  sharesFloat: 53650000,
  marketCap: NaN,
  percentOwnedByInsiders: 40,
  percentOwnedByInstitutions: 29.72,
  price: 44.29,
  name: 'Virgin Galactic Holdings Inc',
  ticker: 'SPCE'
}
```
