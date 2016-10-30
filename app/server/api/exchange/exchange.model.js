'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Exchange', {
    id: {
      type:  DataTypes.UUID ,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    abbrev: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		currency: {
			type: DataTypes.STRING,
			allowNull: true
		},
		timezone_offset: {
			type: DataTypes.TIME,
			allowNull: true
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'exchanges',
		classMethods: {
			associate: (db) => {
				db.Exchange.hasMany(db.Symbol);
			}
		}
  });
};
