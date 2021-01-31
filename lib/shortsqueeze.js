const got = require('got')
const cheerio = require('cheerio')
const _ = require('lodash')

/**
 * Parsing data from the given html page
 * @param {Object} html - DOM object 
 * @returns {Object}
 */
const parseStockData = (html) => {
    const $ = cheerio.load(html)

    // Combine three blocks of data from the main page into one htmlData.
    // This site has such terrible markup that there is no other way to parse the data from the table.
    const
        headerBlock = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(3) > td > table > tbody'),
        quotePrice = headerBlock.find('tr:nth-child(1)').find('td:nth-child(2)').first().text().replace(/[\s]|(\$)/gi, ''),
        quoteName = headerBlock.find('tr:nth-child(1)').find('td:nth-child(1)').first().text().trim(),
        quoteTicker = headerBlock.find('tr:nth-child(2)').find('td:nth-child(1)').first().text().trim(),
        htmlData = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(4) > td > table > tbody').find('tr')
        .add($('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody').find('tr'))
        .add($('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(6) > td > table > tbody').find('tr'))

    // Store data in array
    let shortQuoteData = Array.prototype.map.call(htmlData, (line) => {
        // Convert to cample case and remove special characters
        let key = $(line).find('td:nth-child(1)').first().text().replace(/[^A-Z0-9(%\s)]/gi, '')
        key = key.replace(/%/gi, 'Percent')
        key = _.camelCase(key)

        // Replace lines that starts with the number. '52days' => 'n52days'
        key = key.replace(/^([0-9]{2})/mg, 'n' + key.match(/^([0-9]{2})/mg))

        // Remove numbers from the end of the key
        key = key.replace(/(?:[0-9]{1,10})$/gm, '')

        // Remove whitespaces, commas, dollar and percentage characters
        const value = $(line).find('td:nth-child(2)').first().text().replace(/[\s]|(%)|(,)|(\$)/gi, '')

        // If value is empty or NaN - use null
        if (value !== 'view') {
            return {
                [key]: Number.parseFloat(value) || null
            }
        }
    })

    // Remove undefined elements (true if any, false if undefined)
    shortQuoteData = shortQuoteData.filter(Boolean)

    // Assingn key:value pairs to a single object
    let shortQuoteObj = Object.assign({}, ...shortQuoteData)

    // Add "header" data
    shortQuoteObj.price = Number.parseFloat(quotePrice) || null
    shortQuoteObj.name = quoteName
    shortQuoteObj.ticker = quoteTicker

    return shortQuoteObj.name !== 'Not Available - Try Again' ? shortQuoteObj : {}
}

/**
 * Get full shorts data for chosen ticker
 * 
 * @example
 * const shorts = await shortsqueeze('GME')
 * 
 * @param {String} ticker - ticker of any company
 * @returns {Promise.<Object>} - object of financial data
 * @reject {Error}
 * 
 * Response schema:
 * {
 *     shortInterestRatioDaysToCover: Number,
 *     shortPercentOfFloat: Number,
 *     shortPercentIncreaseDecrease: Number,
 *     shortInterestSharesShort: Number,
 *     shortInterestSharesShortPrior: Number,
 *     percentFrom52WkHigh: Number,
 *     percentFrom50DayMa: Number,
 *     percentFrom200DayMa: Number,
 *     percentFrom52WkLow: Number,
 *     n52WeekPerformance: Number,
 *     tradingVolumeTodayVsAvg: Number,
 *     tradingVolumeToday: Number,
 *     tradingVolumeAverage: Number,
 *     sharesFloat: Number,
 *     marketCap: Number,
 *     percentOwnedByInsiders: Number,
 *     percentOwnedByInstitutions: Number,
 *     price: Number,
 *     name: 'String',
 *     ticker: 'String'
 * }
 */
const quote = async (ticker = '') => {
    try {
        const response = await got(`https://shortsqueeze.com/?symbol=${ticker}`, {
            //!Fuck your insane subscription fee
            followRedirect: false
        })
        const stockShortObj = parseStockData(response.body)
        if (_.isEmpty(stockShortObj)) {
            throw new Error('An empty response returned. Try another ticker!')
        }
        return stockShortObj
    } catch (error) {
        return {
            error: error.message
        }
    }
}

module.exports = quote