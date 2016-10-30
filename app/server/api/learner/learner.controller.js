'use strict';

import _ from 'lodash';
import moment from 'moment';
import request from 'request';
// import the Exchange sequelize model
import { LearningTrial } from '../../sqldb';
// import general http responses
import {handleError} from '../../components/utils/responses';

/**
  @description: creates a trail entry and sends a request to the ml-api to start analysis
*/
const trainPredict = (req, res, err) => {
  // create a learning trial
  LearningTrial.create(JSON.parse(req.body.form))
    .then((trial) => {
      // send request to ml-api for anlysis
      return request.post({
        url: 'http://localhost:9009/train-predict',
        form: {
          train_tickers: trial.train_tickers.join(','),
          predict_tickers: trial.predict_tickers.replace(/[\{|\}]/g, ''),
          date_train_start: trial.date_train_start,
          date_end: trial.date_end,
          date_test_start: trial.date_test_start,
          horizons: trial.horizons.join(','),
          windows: trial.windows.join(','),
          train_trial_id: trial.id
        }
      }, (err, results, body) => {
        if(err){ return handleError(res)(err); }
        // TODO: store the results into the trial instance in the DB
        const results_json = JSON.parse(body);
        trial.results = results_json;
        return res.json(results_json);
      });
    })
    .catch(handleError(res));
}

// export functions to be mapped to routes
module.exports = {
  trainPredict
};
