'use strict';

import _ from 'lodash';
// import the Symbol sequelize model
import { Symbol } from '../../sqldb';
// import general http responses
import {
  handleError, responseWithResult, handleEntityNotFound,
  saveUpdates, removeEntity
} from '../../components/utils/responses';

// Gets a list of Symbols
 function index(req, res) {
  Symbol.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Symbol from the DB
 function show(req, res) {
  Symbol.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Symbol in the DB
 function create(req, res) {
  Symbol.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Symbol in the DB
 function update(req, res) {
  if(req.body.id){ delete req.body.id; }
  Symbol.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Symbol from the DB
 function destroy(req, res) {
  Symbol.find({
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
