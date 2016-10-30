/**
 * Functions to load 5 minute prices of S&P stocks from yahoo finance
 */

'use strict';

import moment from 'moment';
// import {MinutePrice} from '../../sqldb';
import asyncEach from 'async/each';
import request from 'request';

const YAHOO_URL = 'http://chartapi.finance.yahoo.com/instrument/1.0';

// TODO: implement functions for downloading the data into the DB
// 			 then include it in seed operation

/**
	@description: ...
*/
const download5Minute = (ticker_sym, _done) => {
	// a function to parse the downloaded data
	const onDownloaded = (err, resp, body) => {
		// ...
	}

	request.get({
		url: `${YAHOO_URL}/${ticker_sym}/chartdata;type=quote;range=365d/json`
	}, onDownloaded);
}
