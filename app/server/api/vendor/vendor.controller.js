'use strict';

import _ from 'lodash';
// import the Vendor sequelize model
import { Vendor } from '../../sqldb';
// import general http responses
import * from '../../components/utils/responses';

// Gets a list of Vendors
 function index(req, res) {
  Vendor.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Vendor from the DB
 function show(req, res) {
  Vendor.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Vendor in the DB
 function create(req, res) {
  Vendor.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Vendor in the DB
 function update(req, res) {
  if(req.body.id){ delete req.body.id; }
  Vendor.find({
    where: {
      id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Vendor from the DB
 function destroy(req, res) {
  Vendor.find({
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
