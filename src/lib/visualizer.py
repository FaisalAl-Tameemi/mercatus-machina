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


def visualize_predictions(data, title='Actual vs. Predictions', ax=None):
    ax = data.plot(ax=ax)
    ax.set_title(title)
    ax.set_ylabel('Price in $')
    ax.set_xlabel('Dates')
    plt.xticks(rotation=30)
    return ax


def visualize_volatility(data):
    fig, ax = plt.subplots(figsize=(6,6))
    fig.subplots_adjust(hspace=0.8, wspace=0.4)
    data.plot(subplots=True, ax=ax)
    ax.set_ylabel('Volatility')
    ax.set_xlabel('Dates')
    ax.set_title('Stock Volatility')
    return ax


def visualize(data, title = ''):
    ax = data.plot()
    ax.set_title(title)
    ax.set_ylabel('Price in $')
    ax.set_xlabel('Dates')
    plt.xticks(rotation=30)
    return ax