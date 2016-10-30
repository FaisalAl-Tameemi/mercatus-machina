/**
 * ROUTES preprended with `/api/learner/`
 */

'use strict';

var express = require('express');
var controller = require('./learner.controller'); // load response functions

var router = express.Router(); // load the router object

router.post('/train-predict', controller.trainPredict);

module.exports = router;
