'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Price', {
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
    close: {
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
    adj_close: {
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
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'prices',
		classMethods: {
			associate: (db) => {
				db.Price.belongsTo(db.Symbol, {
					foreignKey: 'symbol_id',
					targetKey: 'id'
				});
				db.Price.belongsTo(db.Vendor, {
					foreignKey: 'vendor_id',
					targetKey: 'id'
				});
			}
		}
  });
};
