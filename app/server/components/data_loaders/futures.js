/**
 * Functions to load E-Mini futures from Quandl
 */

'use strict';

import moment from 'moment';
import asyncEach from 'async/each';
import request from 'request';
import fs from 'fs';
import path from 'path';
import quandl_configs from './quandl.config.js';

const QUANDL_URL = 'https://www.quandl.com/api/v3/datasets/CME';
const YEARS = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
const QUARTERS = 'HUMZ'.split('');

const downloadAndInsertFutures = (_done) => {
	// a function to parse the downloaded data
	const onDownloaded = (file_path, _doneDownload) => {
		return (err, resp, body) => {
			if(err) return _doneDownload(err);
			fs.writeFile(file_path, body, _doneDownload);
		}
	}
	// a function which downloads the futures data for a given year and quarter
	const downloadQuarter = (quarter, year, _doneQuarter) => {
		console.log(`Downloading ES${quarter}${year}`);
		const q_file_path = path.resolve(__dirname, `../../../../_data/ES${quarter}${year}.csv`);
		request.get({
			url: `${QUANDL_URL}/ES${quarter}${year}.csv`,
			qs: {
				api_key: quandl_configs.QUANDL_KEY
			}
		}, onDownloaded(q_file_path, _doneQuarter));
	}
	// for all quarters in each year, download the data
	asyncEach(YEARS, (year, _nextYear) => {
		asyncEach(QUARTERS, (quarter, _nextQuarter) => {
			downloadQuarter(quarter, year, _nextQuarter);
		}, _nextYear);
	}, _done);
}

module.exports = {
	downloadAndInsertFutures
};
