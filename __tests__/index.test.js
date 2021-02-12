const shortsqueeze = require('..')

// Sometimes jest needs more time in local workflow testing
jest.setTimeout(10000)

const responseSchema = {
    shortInterestRatioDaysToCover: null,
    shortPercentOfFloat: null,
    shortPercentIncreaseDecrease: null,
    shortInterestCurrentSharesShort: null,
    sharesFloat: null,
    shortInterestPriorSharesShort: null,
    percentFrom52WkHigh: null,
    percentFrom50DayMa: null,
    percentFrom200DayMa: null,
    percentFrom52WkLow: null,
    n52WeekPerformance: null,
    tradingVolumeTodayVsAvg: null,
    tradingVolumeToday: null,
    tradingVolumeAverage: null,
    marketCap: null,
    percentOwnedByInsiders: null,
    percentOwnedByInstitutions: null,
    price: null,
    name: '',
    ticker: ''
}

test('Should get correct parsed data', async () => {
    const stock = await shortsqueeze('GME')
    // Assert that response is not null at least
    expect(stock).not.toEqual({})

    // Assert that String data from the response is correct
    expect(stock.name).toBe('Gamestop Corporation')
    expect(stock.ticker).toBe('GME')

    // Assert that Number data from the response is a number or null
    for (const key of Object.keys(stock)) {
        if (key !== 'name' && key !== 'ticker') {
            try {
                expect(stock[key]).toEqual(expect.any(Number))
            } catch (error) {
                expect(stock[key]).toBeNull()
            }

        }
    }
})

test('Should get correct response schema', async () => {
    const stock = await shortsqueeze('SPCE')

    // Compare response and schema keys
    function compareObjectsKeys(...objects) {
        // Concat all keys into one object
        const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), [])
        // Set contains only unic keys
        const union = new Set(allKeys)
        return objects.every(object => union.size === Object.keys(object).length)
    }

    // Assert that keys in the response are equal to response schema
    expect(compareObjectsKeys(stock, responseSchema)).toEqual(true)
})

test('Should get { Error } object if the ticker is incorrect', async () => {
    const stock = await shortsqueeze('$GME go brrr')

    // Assert that there is an error
    expect(stock.error).toBeDefined()
})