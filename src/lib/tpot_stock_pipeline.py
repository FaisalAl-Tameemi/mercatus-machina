import numpy as np
import pandas as pd
from sklearn.linear_model import LassoLarsCV
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import make_pipeline, make_union
from sklearn.preprocessing import PolynomialFeatures
from tpot.builtins import StackingEstimator

def predict_tpot(tpot_data):
    # tpot_data = pd.read_csv('PATH/TO/DATA/FILE', sep='COLUMN_SEPARATOR', dtype=np.float64)
    features = tpot_data.drop('target', axis=1).values
    training_features, testing_features, training_target, testing_target = \
                train_test_split(features, tpot_data['target'].values, random_state=None)

    # Average CV score on the training set was:-0.24323109444644547
    exported_pipeline = make_pipeline(
        StackingEstimator(estimator=KNeighborsRegressor(n_neighbors=40, p=1, weights="uniform")),
        PolynomialFeatures(degree=2, include_bias=False, interaction_only=False),
        LassoLarsCV(normalize=True)
    )

    exported_pipeline.fit(training_features, training_target)
    results = exported_pipeline.predict(testing_features)

    return results

def get_tpot_pipeline():
    return make_pipeline(
        StackingEstimator(estimator=KNeighborsRegressor(n_neighbors=40, p=1, weights="uniform")),
        PolynomialFeatures(degree=2, include_bias=False, interaction_only=False),
        LassoLarsCV(normalize=True)
    )