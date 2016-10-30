/**
 * Functions to load prices of S&P stocks
 */

'use strict';

import moment from 'moment';
import {Price} from '../../sqldb';
import asyncEach from 'async/each';
import request from 'request';
import quandl_configs from './quandl.config.js';

const QUANDL_URL = 'https://www.quandl.com/api/v3/datasets/WIKI/';

/**
	@description: Downloads the daily prices of a given ticker from Quandl
	@params: `ticker_sym` (STRING -- ticker symbol)
					 `_done` (FUNC -- a callback that recieves an error and a response)
*/
const downloadTickerPrices = (ticker_sym, _done) => {
	// a function to parse the downloaded data
	const onDownloaded = (err, resp, body) => {
		if(err) return _done(err);
		const body_json = JSON.parse(body).dataset;
		return _done(null, body_json);
	}

	request.get({
		url: `${QUANDL_URL}${ticker_sym}.json`,
		qs: {
			api_key: quandl_configs.QUANDL_KEY,
			start_date: '2007-01-01',
			end_date: moment().format('YYYY-MM-DD')
		}
	}, onDownloaded);
}

/**
	@description: Inserts the daily price quotes onto the database
	@params: `symbol` (OBJECT -- ticker symbol object)
					 `quotes` (ARRAY -- an array of daily prices for the symbol)
					 `_done`  (FUNC -- a callback that recieves an error if any)
*/
const insertTickerPrices = (symbol, quotes, _done) => {
	if(!quotes){
		console.log(`Quotes are MISSING for ${symbol.name}`)
		return _done();
	}
	console.log(`Inserting ${symbol.name}'s data -- ${symbol.ticker} with ${quotes.data.length} entries.`);
	asyncEach(quotes.data, (quote, _doneQuoteInsert) => {
		return Price.create({
			open: quote[quotes.column_names.indexOf('Open')],
			high: quote[quotes.column_names.indexOf('High')],
			close: quote[quotes.column_names.indexOf('Close')],
			low: quote[quotes.column_names.indexOf('Low')],
			date: moment(quote[quotes.column_names.indexOf('Date')]).format(),
			volume: quote[quotes.column_names.indexOf('Volume')],
			adj_close: quote[quotes.column_names.indexOf('Adj. Close')],
			symbol_id: symbol.id
		})
		.then(() => {
			_doneQuoteInsert();
			return null;
		})
		.catch(err => {
			_doneQuoteInsert();
			console.log(`Entry for ${symbol.ticker} FAILED`, err.message);
		});
	}, _done);
}

module.exports = {
	downloadTickerPrices,
	insertTickerPrices
}
