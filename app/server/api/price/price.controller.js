'use strict';

import _ from 'lodash';
// import the Price sequelize model
import { Price } from '../../sqldb';
// import general http responses
import * from '../../components/utils/responses';

// Gets a list of Prices
 function index(req, res) {
  Price.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Price from the DB
 function show(req, res) {
  Price.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Price in the DB
 function create(req, res) {
  Price.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Price in the DB
 function update(req, res) {
  if(req.body.id){ delete req.body.id; }
  Price.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Price from the DB
 function destroy(req, res) {
  Price.find({
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
