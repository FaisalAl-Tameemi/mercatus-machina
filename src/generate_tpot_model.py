from tpot import TPOTRegressor
from sklearn.model_selection import train_test_split

# load data
finance = pd.read_csv(data_files[0][2], encoding='utf-8', header=0)
finance = finance.set_index(finance.columns[0])
finance.index.name = 'Date'
finance.index = pd.to_datetime(finance.index)
finance.sort_index()

# perform preprocessing
X_train, y_train, X_test, y_test = \
    st.prepareDataForClassification(finance, DATE_TEST_START, TICKERS_PREDICT, h, w)

tpot = TPOTRegressor(generations=5, population_size=20, verbosity=2)
tpot.fit(X_train, y_train)
print(tpot.score(X_test, y_test))
tpot.export('src/lib/tpot_stock_pipeline.py')