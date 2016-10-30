'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Future', {
    id: {
      type:  DataTypes.UUID ,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
		open: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		last: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		high: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		low: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		settle: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		volume: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		open_interest: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'futures'
  });
};
