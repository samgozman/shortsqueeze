const shortsqueeze = require('..')

// Sometimes jest needs more time in local workflow testing
jest.setTimeout(10000)

const responseSchema = {
    shortInterestRatioDaysToCover: '',
    shortPercentOfFloat: '',
    shortPercentIncreaseDecrease: '',
    shortInterestSharesShort: '',
    shortInterestSharesShortPrior: '',
    percentFrom52WkHigh: '',
    percentFrom50DayMa: '',
    percentFrom200DayMa: '',
    percentFrom52WkLow: '',
    n52WeekPerformance: '',
    tradingVolumeTodayVsAvg: '',
    tradingVolumeToday: '',
    tradingVolumeAverage: '',
    sharesFloat: '',
    marketCap: '',
    percentOwnedByInsiders: '',
    percentOwnedByInstitutions: '',
    price: '',
    name: '',
    ticker: ''
}

test('Should get correct parsed data', async () => {
    const stock = await shortsqueeze('GME')
    expect(stock).not.toBeNull()
    expect(stock.name).toBe('Gamestop Corporation')
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

    expect(compareObjectsKeys(stock, responseSchema)).toEqual(true)
})

test('Should get { Error } object if the ticker is incorrect', async () => {
    const stock = await shortsqueeze('$GME go brrr')
    expect(stock.error).toBeDefined()
})