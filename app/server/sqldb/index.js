/**
 * What's this file for?
 * This is the Sequelize initialization module.
 * It requires all the models which are a part of the API
 *    and creates an exportable DB object for other files to use.
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

let db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// db['migrator'] = sequelize.getMigrator({
//   path:        process.cwd() + '/database/migrations',
//   filesFilter: /\.coffee$/
// });

// require each model from every endpoint with sequelize
// For example: `db.Thing = db.sequelize.import('../api/thing/thing.model');`
db.User = db.sequelize.import('../api/user/user.model');
db.Exchange = db.sequelize.import('../api/exchange/exchange.model');
db.Price = db.sequelize.import('../api/price/price.model');
db.Vendor = db.sequelize.import('../api/vendor/vendor.model');
db.Symbol = db.sequelize.import('../api/symbol/symbol.model');
db.Future = db.sequelize.import('../api/future/future.model');
db.LearningTrial = db.sequelize.import('../api/learner/learner.model');

// run associations from every model here
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;
