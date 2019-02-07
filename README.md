# Build a Stock Price Indicator

## Mercatus Machina

A stock price prediction API built with Python.

__DISCLAIMER:__ This project is build for learning purposes and the author of the code is not responsible for any real financial damages that may occur due to its use. DO NOT use this project as your trusted source for real-life trading transactions.


## Running The Demo

To run the demo, please make sure you have the following installed:

- Scipy (python scientific libraries: numpy, sklearn, pandas, etc..)
- IPython & Jupyter

See the full list of requirements in `./src/requirements.txt`.

- Simply run `jupyter notebook demo.ipynb` in the main directory of the project

Running the the notebook above will run the `/src/download.py` script which downloads data from Quandl for the companies in the **S&P500** list found on Wikipedia.

Once the data is downloaded, other cells in the notebook with leverage the written library file `/src/lib/stocks.py` which contains code for data transformation as well as making predictions.

The notebook also contains visualizations.


## Todo

- [ ] Complete Flask API setup
- [ ] Add more prediction verification methods
- [ ] Add an interface to prediction a set of tickers X days ahead


## Getting In Touch

* [via LinkedIn](http://ca.linkedin.com/in/faisalaltameemi)
* [via Github](https://github.com/FaisalAl-Tameemi)
