'use strict';

const DB_NAME = 'mercatus_machina_dev';
const DB_USERNAME = 'mercatus_machina';
const DB_PASSWORD = 'mM&adsfv0832g';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connecton opions
  sequelize: {
    uri: `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost:5432/${DB_NAME}`,
    options: {
      logging: false,
      // storage: 'dev.sqlite', // ONLY for sqlite
      define: {
        timestamps: true
      }
    }
  },

  // Seed database on startup
  seedDB: false

};
