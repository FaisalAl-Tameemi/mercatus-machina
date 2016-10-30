/**
 * Functions to load the S&P list from Wikipedia
 */

'use strict';

import asyncEach from 'async/each';
import {Symbol} from '../../sqldb';
import request from 'request';
import $ from 'cheerio';

const WIKI_SP500 = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';

/**
	@description: Scrapes and parses the list of SP500 companies from Wikipedia
								into an array of objects.
	@params: `_done` (FUNC -- a callback that recieves an error and a response)
*/
const downloadSymbols = (_done) => {
	// change from human column titles to computer friendly columns titles
	const parseColumnTitle = (title) => {
		return title.toLowerCase().split(' ').join('_');
	}
	// parse the table with cheerio into an array of tickers
	const parseTable = (table) => {
		const entries = table.find('tr');
		const columns = entries.slice(0, 1).find('th')
											.map((i, elm) => parseColumnTitle($(elm).text())).get();
		const rows = entries.slice(1).map((i, elm) => {
			const row_data = {};
			const columns_data = $(elm).find('td').map((i, elm) => $(elm).text()).get();
			return {
				ticker: columns_data[0],
				instrument: 'stock',
				name: columns_data[1],
				sector: columns_data[3],
				currency: 'USD'
			};
		});

		return _done(rows);
	}
	// load the page from wikipedia
	request
	  .get(WIKI_SP500, (err, response, html) => {
			const $page = $.load(html);
			const table = $page('.wikitable').closest('table').slice(0, 1);
			parseTable(table);
	  });
}

/**
	@description: Inserts an array of symbol objects into the database
	@params: `tickers` (ARRAY -- an array of symbol objects)
					 `_done`   (FUNC -- a callback that recieves an error and a response)
*/
const insertSymbols = (tickers, _done) => {
	return asyncEach(tickers, (ticker, _next) => {
		Symbol.create(ticker)
			.then(sym => {
				_next();
				return null;
			})
			.catch(err => _next(err));
	}, _done);
}

module.exports = {
	downloadSymbols,
	insertSymbols
}
