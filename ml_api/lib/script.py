import sys, os, pdb
import pandas as pd
import stocks as st
import script_configs as cf
import uuid
import json
import time
# from sklearn.svm import SVR
from sklearn.linear_model import SGDRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import AdaBoostRegressor, GradientBoostingRegressor
# from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis as QDA
# from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
from sklearn.multioutput import MultiOutputRegressor

directory = '../trials/%s'%uuid.uuid1()
os.makedirs(directory)

print "Loading data for %s..."%', '.join(cf.TICKERS_TRAIN)
data_files = st.loadMergedData(
    cf.WINDOWS, cf.HORIZONS, cf.TICKERS_TRAIN, cf.TICKERS_PREDICT,
    cf.DATE_TRAIN_START, cf.DATE_END, directory
)

# - train each of the models on the data and save the highest performing
# 		model as a pickle file
classifiers = [
    ('GradientBoosted', MultiOutputRegressor(GradientBoostingRegressor())),
    # ('SGD', MultiOutputRegressor(SGDRegressor())),
    # ('GaussianNB', MultiOutputRegressor(GaussianNB())),
    # ('AdaBoost', MultiOutputRegressor(AdaBoostRegressor()))
]

# - combine the results of each classifier along with its w + h into a response object
all_results = {}
# - train each of the models on the data and save the highest performing
#         model as a pickle file
for h, w, file_path in data_files:
    # Start measuing time
    time_start = time.time()
    # load data
    finance = pd.read_csv(file_path, encoding='utf-8', header=0)
    finance = finance.set_index(finance.columns[0])
    # perform preprocessing
    X_train, y_train, X_test, y_test = \
        st.prepareDataForClassification(finance, cf.DATE_TEST_START, cf.TICKERS_PREDICT, h, w)

    results = {}

    # print "/*************************************/\n"
    print "Starting an iteration with a horizon of {} and a window of {}...".format(h, w)

    for i, clf_ in enumerate(classifiers):
        print "Training and testing the %s model..."%(clf_[0])
        # perform k-fold cross validation
        # results['cv_accuracy_%s'%clf_[0]] = \
        #     st.performCV(X_train, y_train, 10, clf_[1], clf_[0])
        # perform predictions with testing data and record result
        preds, results['accuracy_%s'%clf_[0]] = \
            st.trainPredictStocks(X_train, y_train, X_test, y_test, clf_[1], directory)

    results['window'] = w
    results['horizon'] = h

    # Stop time counter
    time_end = time.time()
    results['time_lapsed'] = time_end - time_start

    all_results['H%s_W%s'%(h, w)] = results
    # print "/*************************************/\n"

print json.dumps(all_results, indent=4)
