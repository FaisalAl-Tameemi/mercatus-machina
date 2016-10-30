/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

module.exports = function(app) {

	// Route Example: `app.use('/api/things', require('./api/thing'));`
  // Insert routes below

  // ROOT - loads the client SPA
  app.get('/', (req, res, _next) => {
    res.sendFile(path.join(__dirname + '../client/index.html'));
  });

  app.use('/api/users', require('./api/user'));
  app.use('/api/learner', require('./api/learner'));
  app.use('/api/symbols', require('./api/symbol'));
  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth)/*')
   .get(errors[404]);

};
