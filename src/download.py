import pandas as pd 
import quandl 
import datetime
import bs4 as bs
import pickle
import requests 
import os
import glob


def get_sp500_tickers(save = True, format = 'pickle'):
    resp = requests.get('http://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
    soup = bs.BeautifulSoup(resp.text, 'lxml')
    table = soup.find('table', {'class': 'wikitable sortable'})
    
    tickers = []
    
    for row in table.findAll('tr')[1:]:
        name = row.findAll('td')[0].text
        ticker = row.findAll('td')[1].text
        tickers.append([ticker, name])
        
    tickersDF = pd.DataFrame(tickers, columns=['symbol', 'name'])
    
    if save == True:
        if format == 'pickle':
            with open("_data/sp500_tickers.pickle", "wb") as f:
                pickle.dump(tickersDF, f)
        else:
            tickersDF.to_csv('_data/sp500_tickers.csv')

    return tickersDF


def download_ticker_data(start = datetime.datetime(2016, 1, 1), end = datetime.date.today()):
    quandl.ApiConfig.api_key = "umHqBp9ux19uReWqZzCz"
    tickers = get_sp500_tickers(format = 'csv')

    for symbol in tickers.symbol:
        try:
            symbol_data = quandl.get("WIKI/{}".format(symbol), start_date = start, end_date = end)
            symbol_data.to_csv("_data/tickers/{}.csv".format(symbol))
        except:
            print("Failed to get data from SYMBOL = {}".format(symbol))


def merge_all_tickers():
    dir = os.getcwd()
    allFiles = glob.glob(dir + "/_data/tickers/*.csv")

    print("Merging all ticker data into a single file...")

    list_ = []

    for file_ in allFiles:
        if 'sp500_tickers' not in file_:
            print("Merging '{}'".format(file_))
            df = pd.read_csv(file_, index_col=None, header=0)
            df['ticker'] = file_.split("/")[-1].split(".")[0]
            df = df[['ticker', 'Date', 'Adj. Close', 'Volume']]
            df = df.rename(index=str, columns={"Date": "date", "Volume": "volume", "Adj. Close": "adj_close"})

            list_.append(df)

    frame = pd.concat(list_, axis = 0, ignore_index = True)
    frame.to_csv("_data/sp500_tickers_all.csv", index=False)

    return frame


if __name__ == "__main__":
    # download_ticker_data()
    merge_all_tickers()