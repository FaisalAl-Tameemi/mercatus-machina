'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LearningTrial', {
    id: {
      type:  DataTypes.UUID ,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
		train_tickers: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false
		},
    predict_tickers: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: false
		},
    date_train_start: {
			type: DataTypes.DATE,
			allowNull: false
		},
    date_test_start: {
			type: DataTypes.DATE,
			allowNull: false
		},
    date_end: {
			type: DataTypes.DATE,
			allowNull: false
		},
    folds: {
			type: DataTypes.INTEGER,
			allowNull: false,
      defaultValue: 10
		},
    horizons: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [7, 14, 21, 28]
		},
    windows: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      defaultValue: [5, 10]
		},
    results: {
			type: DataTypes.JSONB,
      allowNull: true
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'learning_trials'
  });
};
