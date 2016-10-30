#!/usr/bin/env python

from flask import Flask, request, jsonify, Response
from db import engine
from flask_restful import Api
import sys, os, pdb
import pandas as pd
import numpy as np
from json import dumps as jsonify

from lib.util import jsonResponse
import lib.stocks as st

# from sklearn.svm import SVR
# from sklearn.linear_model import SGDRegressor
# from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import GradientBoostingRegressor#, AdaBoostRegressor
from sklearn.multioutput import MultiOutputRegressor


app = Flask(__name__)
api = Api(app)
conn = engine.connect()

# Example request
# @app.route("/tickers", methods=['GET'])
# def tickers():
#     resp = conn.execute("SELECT ticker, name FROM symbols")
#     return jsonResponse(resp)


# @requires: {
#       tickers: [STRING]
#       predict_ticker: STRING
#       date_start: STRING
#       date_end: STRING
#       date_test_start: STRING
#       horizons: INT (default: [1, 7, 14, 21, 28])
#       windows: INT (default: [1, 7, 14, 21, 28])
#       train_trial_id: STRING
# }
@app.route("/train-predict", methods=['POST'])
def train_test():
    """
    - Loads the data from the DB for specified tickers and time range
    - Preprocesses the data by creating columns for rolling_mean, horizon returns, etc..
    - Creates CSV files for each (horizon, window) combo for each dataset (after NA cleanup)
    - Trains various models on each dataset and record their accuracy of testing
    - Return all the results
    """
    content = request.form
    tickers = content['train_tickers'].split(',')
    tickers_predict = content['predict_tickers'].split(',')
    horizons = [int(x) for x in content['horizons'].split(',')]
    windows = [int(x) for x in content['windows'].split(',')]
    # make a directory for the files of this train-predict trial
    directory = 'trials/{}'.format(content['train_trial_id'])
    os.makedirs(directory) # create the directory
    # - load the data and save the final shifted output into a pickle file
    #         for each of the h, w combinations
    data_files = st.loadMergedData(
        windows, horizons, tickers, tickers_predict,
        content['date_train_start'], content['date_end'], directory
    )

    classifiers = [
        ('GradientBoosted', MultiOutputRegressor(GradientBoostingRegressor())),
        # ('AdaBoost', MultiOutputRegressor(AdaBoostRegressor()))
    ]

    # - combine the results of each classifier along with its w + h into a response object
    all_results = []
    # - train each of the models on the data and save the highest performing
    #         model as a pickle file
    for h, w, file_path in data_files:
        finance = pd.read_csv(file_path, encoding='utf-8', header=0, index_col='date_index')
        X_train, y_train, X_test, y_test = \
            st.prepareDataForClassification(finance, content['date_test_start'], tickers_predict, h, w)

        results = {}

        print "/*************************************/\n"
        print "Starting an iteration with a horizon of {} and a window of {}".format(h, w)

        for i, clf_ in enumerate(classifiers):
            # perform classification with cross validation
            accuracy = st.performCV(X_train, y_train, 10, clf_[1], clf_[0])
            # insert the results into list
            results[clf_[0]] = accuracy

        results['window'] = w
        results['horizon'] = h
        all_results.append(results)
        print "/*************************************/\n"

    print jsonify(all_results)

    # - return a results object containing the locations of all the data files + model file
    return jsonResponse(all_results)


if __name__ == '__main__':
    app.run(debug=True, port=9009)
