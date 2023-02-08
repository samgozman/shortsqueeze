import shortsqueeze from '..';

// Sometimes jest needs more time in local workflow testing
jest.setTimeout(10000);

test('Should get correct parsed data', async () => {
  const stock = (await shortsqueeze('AAPL'))!;
  expect(stock).toBeDefined();

  // Assert that String data from the response is correct
  expect(stock.name).toBe('Apple Inc');
  expect(stock.ticker).toBe('AAPL');
  expect(stock.price).toEqual(expect.any(Number));
  expect(stock.shortInterestRatioDaysToCover).toBeDefined();
  expect(stock.shortPercentOfFloat).toBeDefined();
  expect(stock.shortPercentIncreaseDecrease).toBeDefined();
  expect(stock.shortInterestCurrentSharesShort).toBeDefined();
  expect(stock.sharesFloat).toBeDefined();
  expect(stock.shortInterestPriorSharesShort).toBeDefined();
  expect(stock.percentFrom52WkHigh).toBeDefined();
  expect(stock.percentFrom50DayMa).toBeDefined();
  expect(stock.percentFrom200DayMa).toBeDefined();
  expect(stock.percentFrom52WkLow).toBeDefined();
  expect(stock.n52WeekPerformance).toBeDefined();
  expect(stock.tradingVolumeTodayVsAvg).toBeDefined();
  expect(stock.tradingVolumeToday).toBeDefined();
  expect(stock.tradingVolumeAverage).toBeDefined();
  expect(stock.marketCap).toBeDefined();
  expect(stock.percentOwnedByInsiders).toBeDefined();
  expect(stock.percentOwnedByInstitutions).toBeDefined();
});

test('Should get undefined object if the ticker is incorrect', async () => {
  const stock = await shortsqueeze('$GME go brrr');

  // Assert that there is an error
  expect(stock).toBeUndefined();
});
