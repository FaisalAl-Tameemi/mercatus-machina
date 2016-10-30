/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import loadersUtil from '../components/data_loaders';
import {User, Symbol, Price} from '../sqldb';
import asyncWaterfall from 'async/waterfall';
import asyncEachLimit from 'async/eachLimit';

const seedUsers = () => {
	User.sync()
	  .then(function() {
	    return User.destroy({ where: {} });
	  })
	  .then(function() {
	    User.bulkCreate([{
	      provider: 'local',
	      name: 'Test User',
	      email: 'test@example.com',
	      password: 'test'
	    }, {
	      provider: 'local',
	      role: 'admin',
	      name: 'Admin',
	      email: 'admin@example.com',
	      password: 'admin'
	    }])
	    .then(function() {
	      console.log('finished populating users');
	    });
	  });
}

const seedSymbols = (_done) => {
	console.log('About to download symbols...');
	Symbol.sync()
		.then(() => {
			return Symbol.destroy({where: {}});
		})
		.then(() => {
			return loadersUtil.symbols.downloadSymbols((data) => {
				loadersUtil.symbols.insertSymbols(data, () => {
					Symbol.findAll({where: {}}).then((results) => _done(null, results));
				});
			});
		});
}

const seedPrices = (symbols, _done) => {
	console.log('About to download prices...');
	Price.sync()
		.then(() => {
			return Price.destroy({where: {}});
		})
		.then(() => {
			return asyncEachLimit(symbols, 8, (symbol, _donePriceSeed) => {
				loadersUtil.prices.downloadTickerPrices(symbol.ticker, (err, quotes) => {
					if(err) return _donePriceSeed(err);
					loadersUtil.prices.insertTickerPrices(symbol, quotes, _donePriceSeed);
				});
			}, _done);
		});
}

const seedFutures = (_done) => {
	console.log('About to download futures...');
	loadersUtil.futures.downloadAndInsertFutures(_done);
}

asyncWaterfall([
	// (_step) => seedFutures(_step),
	(_step) => seedSymbols(_step),
	(symbols, _step) => seedPrices(symbols, _step)
], (err, result) => {
	if(err) return console.log('ERROR during seed op', err);
	console.log('done seed.')
})
