'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Symbol', {
    id: {
      type:  DataTypes.UUID ,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    ticker: {
			type: DataTypes.STRING,
			allowNull: false
		},
		instrument: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sector: {
			type: DataTypes.STRING,
			allowNull: true
		},
		currency: {
			type: DataTypes.STRING,
			allowNull: true
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'symbols',
		classMethods: {
			associate: (db) => {
				db.Symbol.belongsTo(db.Exchange, {
					foreignKey: 'exchange_id',
					targetKey: 'id'
				});
				db.Symbol.hasMany(db.Price);
			}
		}
  });
};
