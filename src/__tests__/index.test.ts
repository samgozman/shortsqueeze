import shortsqueeze from '..';

// Sometimes jest needs more time in local workflow testing
jest.setTimeout(10000);

test('Should get correct parsed data', async () => {
  const stock = (await shortsqueeze('GME'))!;
  expect(stock).toBeDefined();

  // Assert that String data from the response is correct
  expect(stock.name).toBe('Gamestop Corporation');
  expect(stock.ticker).toBe('GME');

  expect(stock.shortPercentOfFloat).toEqual(expect.any(Number));
  expect(stock.price).toEqual(expect.any(Number));
});

test('Should get undefined object if the ticker is incorrect', async () => {
  const stock = await shortsqueeze('$GME go brrr');

  // Assert that there is an error
  expect(stock).toBeUndefined();
});
