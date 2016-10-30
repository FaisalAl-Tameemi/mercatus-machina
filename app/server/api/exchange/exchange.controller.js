'use strict';

import _ from 'lodash';
// import the Exchange sequelize model
import { Exchange } from '../../sqldb';
// import general http responses
import * from '../../components/utils/responses';

// Gets a list of Exchanges
 function index(req, res) {
  Exchange.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Exchange from the DB
 function show(req, res) {
  Exchange.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Exchange in the DB
 function create(req, res) {
  Exchange.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Exchange in the DB
 function update(req, res) {
  if(req.body.id){ delete req.body.id; }
  Exchange.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Exchange from the DB
 function destroy(req, res) {
  Exchange.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

// export functions to be mapped to routes
module.exports = {
  index, show, create, update, destroy
};
