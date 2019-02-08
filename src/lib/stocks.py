import __future__
from math import floor
import pickle as cPickle
import numpy as np
import pandas as pd
from sklearn import neighbors, preprocessing
import operator
from pandas_datareader.data import DataReader
import re
from dateutil import parser
import datetime
from datetime import datetime
from sklearn.metrics import r2_score, mean_squared_error
import sys, os, pdb
import seaborn as sns
import matplotlib.pyplot as plt

sys.path.append('../')

import lib.visualizer as vzr
# from db import engine



def mean_absolute_percentage_error(y_true, y_pred):
    """
    Similar to mean squared error but instead calculates the mean percentage error
    """
    y_true = y_true.values
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100



def volatility(df, columns, window):
    """
    calculate the rolling standard deviation and normalize it by 252 traiding days
    for the returns columns.
    Return a series of transformed values (daily volatility).
    """
	# calculate log returns from closing prices
    returns = np.log(df[columns] / df[columns].shift(1))
	# calculate volatility and return
    return returns.rolling(window=window).std() * np.sqrt(252)



def count_missing(dataframe):
    """
    count number of NaN in dataframe
    """
    return (dataframe.shape[0] * dataframe.shape[1]) - dataframe.count().sum()



def addRollingFeature(data, symbol, window):
    """
    Add a column for the moving average of the adjusted closing price.
    """
    roll_col = "roll_mean_" + str(window) + '_' + str(symbol)
    data[roll_col] = data['adj_close_%s'%symbol].rolling(window=window).mean()



def applyRollMeanDelayedReturns(datasets, windows, symbols):
    """
    applies rolling mean and delayed returns to each dataframe in the list
    """
    for data, sym in zip(datasets, symbols):
        for win in windows:
            addRollingFeature(data, symbol=sym, window=win)

    return datasets



def applyLags(dataset, lags, predict_symbols):
    """
    Shift the returns and adj_close data of each symbol to be predicted
    and add those lag values as new columns.
    """
    for symbol in predict_symbols:
        for l in lags:
            new_col_returns = 'returns_%s_%s'%(symbol,str(l))
            new_col_adj_close = 'adj_close_%s_%s'%(symbol,str(l))
            dataset[new_col_returns] = dataset['returns_%s'%symbol].shift(-1*l)
            dataset[new_col_adj_close] = dataset['adj_close_%s'%symbol].shift(-1*l)

    return dataset.iloc[max(lags):-1,:]



def applyHorizons(dataset, horizons, predict_symbols):
    """
    Shift the returns and adj_close data of each symbol to be predicted
    and add those horizon values as new columns.
    """
    for symbol in predict_symbols:
        for h in horizons:
            new_col_returns = 'returns_%s_%s'%(symbol,str(h))
            new_col_adj_close = 'adj_close_%s_%s'%(symbol,str(h))
            dataset[new_col_returns] = dataset['returns_%s'%symbol].shift(h)
            dataset[new_col_adj_close] = dataset['adj_close_%s'%symbol].shift(h)

    # return dataset.iloc[max(horizons):-1,:]
    return dataset[:-max(horizons)]



def prepareDataForClassification(dataset, start_test, end_test, predict_symbols, horizon, window):
    """
    generates categorical output column, attach to dataframe
    label the categories and split into train and test
    """
    dataset = dataset.sort_index()

    predict_cols = ["adj_close_%s"%sym for sym in predict_symbols]
    data_cols = [col for col in dataset.columns if col not in predict_cols]

    # uncomment lines below for classification
    # label encode all return columns
    # X[returns_cols] = X[returns_cols].applymap(lambda x: True if x > 0 else False)

    # train data
    X = dataset[data_cols]
    # train labels / outputs
    y = dataset[predict_cols]

    start_test = parser.parse(start_test)
    end_test = parser.parse(end_test)

    X_train = X[X.index < start_test]
    y_train = y[y.index < start_test]

    X_test = X[(X.index >= start_test) & (X.index <= end_test)]
    y_test = y[(y.index >= start_test) & (X.index <= end_test)]

    return X_train, y_train, X_test, y_test



def trainPredictStocks(X_train, y_train, X_test, y_test, algo, files_directory):
    """
    Trains the provided algorithm with the specified training data.
    Testings the algorithm and evaluates it with mean absolute error.
    Returns the predictions and the accuracy
    """
    model = algo.fit(X_train, y_train)
    y_predict = model.predict(X_test)
    percent_error = mean_absolute_percentage_error(y_test, y_predict)
    y_predict = pd.DataFrame(y_predict, columns=y_test.columns, index=y_test.index)
    # join and plot
    results = y_test.join(y_predict, rsuffix='_pred', lsuffix='_true').sort_index()

    # uncomment below to visualize predictions vs actual
    # vzr.visualize_predictions(results, title='Testing Data Results')

    # save predictions to a csv file
    # uncomment lines below to save predictions of each fold
    file_path = '{}/predictions.csv'.format(files_directory)
    results.to_csv(file_path, sep=',', encoding='utf-8', header=True)

    return results, percent_error



def performCV(X_train, y_train, number_folds, model, label, visualize_folds = False):
    """
    Given X_train and y_train (the test set is excluded from the Cross Validation),
    number of folds, the ML algorithm to implement and the parameters to test,
    the function acts based on the following logic: it splits X_train and y_train in a
    number of folds equal to number_folds. Then train on one fold and tests accuracy
    on the consecutive as follows:
    - Train on fold 1, test on 2
    - Train on fold 1-2, test on 3
    - Train on fold 1-2-3, test on 4
    ....
    Returns mean of test accuracies.
    """
    # print "================================"
    # print "About to start folding for {}".format(label)
    # k is the size of each fold. It is computed dividing the number of
    # rows in X_train by number_folds. This number is floored and coerced to int
    k = int(np.floor(float(X_train.shape[0]) / number_folds))
    # print 'Size of each fold: ', k

    # initialize to zero the accuracies array. It is important to stress that
    # in the CV of Time Series if I have n folds I test n-1 folds as the first
    # one is always needed to train
    folds = range(2, number_folds + 1)
    accuracies = np.zeros(number_folds-1)

    # create a shared plot for all folds
    fig, ax = plt.subplots(3, 3, sharey='row')

    fig.set_figheight(11)
    fig.set_figwidth(9)
    fig.subplots_adjust(hspace=0.8, wspace=0.4)

    # loop from the first 2 folds to the total number of folds
    for i in folds:
        # print "-----"
        # split percentage
        split = float(i-1)/i

        # print 'Splitting the first ' + str(i) + ' chunks at ' + str(i-1) + '/' + str(i)

        # Take a subset of the data depending on the fold number
        X = X_train[:(k*i)]
        y = y_train[:(k*i)]
        # print 'Size of train + test: ', X.shape # the size of the dataframe is going to be k*i

        # X and y contain both the folds to train and the fold to test.
        # index is the integer telling us where to split, according to the
        # split percentage we have set above
        index = int(np.floor(X.shape[0] * split))

        # folds used to train the model
        X_trainFolds = X[:index]
        y_trainFolds = y[:index].astype('long')

        # fold used to test the model
        X_testFold = X[(index + 1):]
        y_testFold = y[(index + 1):].astype('long')

        # fit the model
        fitted = model.fit(X_trainFolds, y_trainFolds)
        predictions = fitted.predict(X_testFold)

        # add the result to the list of accuracies
        # accuracies[i-2] = r2_score(y_testFold, predictions, multioutput='raw_values') # r^2
        # accuracies[i-2] = mean_squared_error(y_testFold, predictions, multioutput='raw_values') # mse
        # mean abs percentage err
        accuracies[i-2] = mean_absolute_percentage_error(y_testFold, predictions)

        percent_error = mean_absolute_percentage_error(y_testFold, predictions)
        preds_df = pd.DataFrame(predictions, columns=y_testFold.columns, index=y_testFold.index)
        # join and plot
        results = y_testFold.join(preds_df, rsuffix='_pred', lsuffix='_true').sort_index()
        
        if visualize_folds == True:
            viz = vzr.visualize_predictions(results, ax=ax[int((i - 2)/3)][(i - 2)%3], title="Predictions on Fold #{}".format(i))
            ax[int((i - 2)/3)][(i - 2)%3].get_legend().remove()

    # the function returns the mean of the accuracy on the n-1 folds
    # print 'Accuracy mean: {}'.format(accuracies.mean())
    return round(np.mean(accuracies), 3)


def getStockDataFromDB(ticker, start_string, end_string):
    """
    Collects predictors data from a database populated by Yahoo Finance and Quandl.
    Returns a dataframe.
    """
    # full cols list ==> p.open, p.high, p.low, p.close, p.adj_close, p.volume
    query = """
        SELECT to_char(p.date, 'DD-MM-YYYY') AS date, p.adj_close, p.volume
        FROM prices AS p
        JOIN symbols AS s
        ON CAST(s.id AS text) = CAST(p.symbol_id AS text)
        WHERE CAST(s.ticker AS text) = '{}'
        AND   (CAST(p.date AS date) BETWEEN CAST('{}' AS date) AND CAST('{}' AS date))
        ORDER BY p.date DESC
    """.format(ticker, start_string, end_string)
    # read the sql results into a dataframe
    df = pd.read_sql_query(query, con=engine)
    df['date'] = pd.to_datetime(df['date'], utc=True)
    df = cleanTickerData(df, ticker)
    df = df.rename(columns={'date_%s'%ticker: 'date'}).set_index('date')

    # uncomment lines below to visualize the correlation matrix
    # vzr.visualize_heatmap(ticker=ticker, data=df)

    return df


def getStockDataFromCSV(tickers, start_string, end_string):
    datasets = []
    # read data path relative to being inside of ml_api folder
    data = pd.read_csv('_data/sp500_tickers_all.csv', encoding='utf-8', header=0)
    start_date = parser.parse(start_string)
    end_date = parser.parse(end_string)

    for t in tickers:
        ticker_data = data[data.ticker.str.contains(t)].set_index('date')
        ticker_data.index = pd.to_datetime(ticker_data.index)
        ticker_data = ticker_data.drop(['ticker'], axis=1)
        ticker_data = ticker_data.loc[(ticker_data.index >= start_date) & (ticker_data.index <= end_date)]
        ticker_data = cleanTickerData(ticker_data, t)
        datasets.append(ticker_data)
    
    return datasets


def cleanTickerData(df, ticker):
    df['returns'] = df['adj_close'].pct_change()
    # make volume a pct_change value since it's too large
    df['volume'] = df['volume'].pct_change()
    df.columns = df.columns + '_' + ticker
    return df


def interpolateData(data):
    data_internal = data.interpolate(method='linear') # linear interpolation
    data_internal = data_internal.fillna(data.mean()) # mean interpolation
    data_internal = data_internal.fillna(method='ffill')
    data_internal = data_internal.fillna(method='bfill') # front and back fill
    # print("Count missing: {}".format(count_missing(data_internal)))
    return data_internal


def joinData(data, start, end):
    merged = pd.concat(data, axis=1)
    merged.index = pd.to_datetime(merged.index) #.strftime('%d-%m-%Y')

    # generate date range with only business days
    pd_date_range = pd.date_range(start=start, end=end, freq='B')
    # pd_date_range = pd_date_range.format(formatter=lambda x: x.strftime('%d-%m-%Y'))
    # merge all data into a single dataframe
    finance = pd.DataFrame(index=pd_date_range)
    
    joined = finance.join(merged, how='left')
    joined.index = pd.to_datetime(joined.index)

    return merged, joined


def loadMergedData(windows, horizons, train_tickers, predict_tickers, time_start, time_end, test_start, files_directory):
    """
    Loads the data from the database (or CSV file) for the specified tickers
    and applies preprocessing steps such as adding new features and interplating.
    """
    data_files = []
    # datasets = [getStockDataFromDB(ticker, time_start, time_end) for ticker in train_tickers]
    datasets = getStockDataFromCSV(train_tickers, time_start, time_end)
    plot_columns = ['adj_close_%s'%ticker for ticker in train_tickers]
    pred_plot_columns = ['adj_close_%s'%ticker for ticker in predict_tickers]

    # Create a prepprocessed file for each of the horizons for the each of the windows specified
    for h in horizons:
        horizon_range = range(2, h)
        for w in windows:
            windows_range = range(2, w)
            # make a copy of all the datasets loaded from the DB
            data = [df.copy() for df in datasets]
            # apply rolling mean for window = delta
            data = applyRollMeanDelayedReturns(data, windows=windows_range, symbols=train_tickers)
            merged, finance = joinData(data, time_start, time_end)

            finance = interpolateData(finance)

            # plot the volatility of the adjusted returns
            print("Volatility Graphs...")
            vzr.visualize_volatility(volatility(finance, columns=plot_columns, window=w))

            # Add columns of future days into each row
            finance = applyLags(finance, horizon_range, predict_tickers)
            # finance = applyHorizons(finance, horizon_range, predict_tickers)
            finance = interpolateData(finance)

            for c in plot_columns:
                merged[c] = merged[c].fillna(merged[c].mean()).rolling(window=h).mean()
            vzr.visualize(merged[plot_columns], title='All Tickers - Rolling Mean (window={})'.format(h))

            vzr.visualize(merged.loc[pd.to_datetime(merged.index) >= parser.parse(test_start)][pred_plot_columns], \
                            title='Pred Tickers - Test Data - Rolling Mean (window={})'.format(h))

            # output the data onto a CSV file
            file_path = '{}/finance_w{}_h{}.csv'.format(files_directory, h, w)
            finance.to_csv(file_path, sep=',', encoding='utf-8', header=True)
            data_files.append((h, w, file_path))

    return data_files
