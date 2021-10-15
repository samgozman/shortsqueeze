import got from 'got';
import cheerio from 'cheerio';
import _ from 'lodash';

export interface IStock {
  shortInterestRatioDaysToCover: number;
  shortPercentOfFloat: number;
  shortPercentIncreaseDecrease: number;
  shortInterestCurrentSharesShort: number;
  sharesFloat: number;
  shortInterestPriorSharesShort: number;
  percentFrom52WkHigh: number;
  percentFrom50DayMa: number;
  percentFrom200DayMa: number;
  percentFrom52WkLow: number;
  n52WeekPerformance: number;
  tradingVolumeTodayVsAvg: number;
  tradingVolumeToday: number;
  tradingVolumeAverage: number;
  marketCap: number;
  percentOwnedByInsiders: number;
  percentOwnedByInstitutions: number;
  price: number;
  name: string;
  ticker: string;
}

/**
 * Parsing data from the given html page
 * @param {Object} html - DOM object
 * @return {IStock}
 */
const parseStockData = (html: string): IStock | undefined => {
  const $ = cheerio.load(html);

  // Combine three blocks of data from the main page into one htmlData.
  // This site has such terrible markup that there is no other way to parse the data from the table.
  const headerBlock = $(
      'body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(3) > td > table > tbody'
    ),
    quotePrice = headerBlock
      .find('tr:nth-child(1)')
      .find('td:nth-child(2)')
      .first()
      .text()
      .replace(/[\s]|(\$)/gi, ''),
    quoteName = headerBlock
      .find('tr:nth-child(1)')
      .find('td:nth-child(1)')
      .first()
      .text()
      .trim(),
    quoteTicker = headerBlock
      .find('tr:nth-child(2)')
      .find('td:nth-child(1)')
      .first()
      .text()
      .trim(),
    htmlData = $(
      'body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(4) > td > table > tbody'
    )
      .find('tr')
      .add(
        $(
          'body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(5) > td > table > tbody'
        ).find('tr')
      )
      .add(
        $(
          'body > div > table:nth-child(5) > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(6) > td > table > tbody'
        ).find('tr')
      );

  // Store data in array
  let shortQuoteData = Array.prototype.map.call(htmlData, (line) => {
    // Convert to cample case and remove special characters
    let key = $(line)
      .find('td:nth-child(1)')
      .first()
      .text()
      .replace(/[^A-Z0-9(%\s)]/gi, '');
    key = key.replace(/%/gi, 'Percent');
    key = _.camelCase(key);

    // Replace lines that starts with the number. '52days' => 'n52days'
    key = key.replace(/^([0-9]{2})/gm, 'n' + key.match(/^([0-9]{2})/gm));

    // Remove numbers from the end of the key
    key = key.replace(/(?:[0-9]{1,10})$/gm, '');

    // Remove whitespaces, commas, dollar and percentage characters
    const value = $(line)
      .find('td:nth-child(2)')
      .first()
      .text()
      .replace(/[\s]|(%)|(,)|(\$)/gi, '');

    // If value is empty or NaN
    if (value.toLowerCase() !== 'view') {
      return {
        [key]: +value || NaN,
      };
    }
  });

  // Remove undefined elements (true if any, false if undefined)
  shortQuoteData = shortQuoteData.filter(Boolean);

  // Assingn key:value pairs to a single object
  let shortQuoteObj: IStock = Object.assign({}, ...shortQuoteData);

  // Add "header" data
  shortQuoteObj.price = +quotePrice || NaN;
  shortQuoteObj.name = quoteName;
  shortQuoteObj.ticker = quoteTicker;

  return shortQuoteObj.name.toLowerCase() !== 'not available - try again'
    ? shortQuoteObj
    : undefined;
};

/**
 * Get full shorts data for chosen ticker
 *
 * @example
 * const shorts = await shortsqueeze('GME')
 *
 * @async
 * @param {String} ticker - ticker of any company
 * @return {Promise.<IStock> | undefined} - object of financial data
 */
export const shortsqueeze = async (
  ticker: string = ''
): Promise<IStock | undefined> => {
  try {
    const response = await got(`https://shortsqueeze.com/?symbol=${ticker}`, {
      //!Fuck your insane subscription fee
      followRedirect: false,
    });

    return parseStockData(response.body);
  } catch {
    return undefined;
  }
};

export default shortsqueeze;
