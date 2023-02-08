import got from 'got';
import { load } from 'cheerio';
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
  const $ = load(html);
  const htmlTable = $(
    'body > div.container.index_container > div.row.after-login-data-row.new_index_header > div > div.col-md-6.data-shortsqueeze-right_box_column.right_box_column.for-width-full > div.right_side_box > div.inner_box_2 > table > tbody'
  ).find('tr');

  const parsedTable: Record<string, number>[] = [];
  htmlTable.each((i, line) => {
    // Skip the header
    if (i < 3) {
      return;
    }

    // Convert to camel case and remove special characters
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

    if (key === '') {
      return;
    }

    // Remove white spaces, commas, dollar and percentage characters
    const value = $(line)
      .find('td:nth-child(2)')
      .first()
      .text()
      .replace(/[\s]|(%)|(,)|(\$)/gi, '');

    parsedTable.push({
      [key]: value.toLowerCase() !== 'view' ? +value || NaN : NaN,
    });
  });

  // Assign key:value pairs to a single object
  let shortQuoteObj: IStock = Object.assign({}, ...parsedTable);

  shortQuoteObj.price =
    +htmlTable
      .find('tr:nth-child(1) > td:nth-child(2)')
      .first()
      .text()
      .trim() || NaN;

  shortQuoteObj.name = htmlTable
    .find('tr:nth-child(1) > td')
    .first()
    .text()
    .trim();

  shortQuoteObj.ticker = htmlTable
    .find('tr:nth-child(2) > td')
    .first()
    .text()
    .trim();

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
