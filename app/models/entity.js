'use strict';

module.exports = function(sequelize, DataTypes) {
  var Entity =  sequelize.define('Entity', {
    entityId: {
      type: DataTypes.BIGINT(11),
      primaryKey: true,
      autoIncrement: true
    },
    entityType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'entity',
    freezeTableName: true,
    associate: function(models)
    {
      Entity.hasMany(models.User, { as: 'users', foreignKey: 'userId' });
    }
  });

  return Entity;
};
