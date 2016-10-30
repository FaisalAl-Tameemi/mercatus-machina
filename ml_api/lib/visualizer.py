import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pdb

# set plotting styles
sns.set_style("darkgrid")

def visualize_heatmap(ticker, data):
    corr = data.corr()
    cols = [col.replace('_%s'%ticker, '') for col in corr.columns.values]
    mtx = sns.heatmap(corr, xticklabels=cols, yticklabels=cols)
    mtx.set_title('Corrleation Matrix Heatmap')
    return mtx


def visualize_predictions(data, title='Actual vs. Predictions'):
    ax = data.plot()
    ax.set_title(title)
    ax.set_ylabel('Price in $')
    ax.set_xlabel('Dates')
    return ax


def visualize_volatility(data):
    vlt = data.plot(subplots=True, figsize=(6, 6))
    vlt.set_ylabel('Volatility')
    vlt.set_xlabel('Dates')
    vlt.set_title('Stock Volatility')
    return vlt
