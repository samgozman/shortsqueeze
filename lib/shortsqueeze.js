const got = require('got')
const cheerio = require('cheerio')
const _ = require('lodash')

const parseStockData = (html) => {
    const $ = cheerio.load(html)
    // Hardcoded, because shortsqueeze site html markup is incredible shit
    const
        firstBlock = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(3) > td > table > tbody'),
        secondBlock = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(4) > td > table > tbody').find('tr'),
        thirdBlock = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody').find('tr'),
        fourthBlock = $('body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(6) > td > table > tbody').find('tr')

    // Only combines lasth three blocks. First one is a header (ish)
    const combine = secondBlock.add(thirdBlock).add(fourthBlock)

    // Store data in array
    let shortQuoteData = Array.prototype.map.call(combine, (line) => {
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

        if (value !== 'view') {
            return {
                [key]: Number.parseFloat(value)
            }
        }

    })

    // Remove undefined elements (true if any, false if undefined)
    shortQuoteData = shortQuoteData.filter(Boolean)

    // Assingn key:value pairs to a single object
    let shortQuoteObj = Object.assign({}, ...shortQuoteData)

    // Add "header" data
    shortQuoteObj.price = Number.parseFloat(firstBlock.find('tr:nth-child(1)').find('td:nth-child(2)').first().text().replace(/[\s]|(\$)/gi, ''))
    shortQuoteObj.name = firstBlock.find('tr:nth-child(1)').find('td:nth-child(1)').first().text().trim()
    shortQuoteObj.ticker = firstBlock.find('tr:nth-child(2)').find('td:nth-child(1)').first().text().trim()

    return shortQuoteObj.name !== 'Not Available - Try Again' ? shortQuoteObj : {}
}

const stock = async (ticker = '') => {
    try {
        const response = await got(`https://shortsqueeze.com/?symbol=${ticker}`, {
            //!Fuck your insane subscription fee
            followRedirect: false
        })
        const stockShortObj = parseStockData(response.body)

        return stockShortObj
    } catch (error) {
        return { error }
    }
}

module.exports = stock