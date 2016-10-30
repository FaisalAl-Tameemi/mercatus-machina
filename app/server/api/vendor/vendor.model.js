'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Vendor', {
    id: {
      type:  DataTypes.UUID ,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		website_url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		support_email: {
			type: DataTypes.STRING,
			allowNull: true
		}
  },{
    timestamps: true,
    underscored: true,
    freezeTableName:true,
    tableName:'vendors',
		classMethods: {
			associate: (db) => {
				db.Vendor.hasMany(db.Price);
			}
		}
  });
};
