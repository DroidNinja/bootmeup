'use strict';

module.exports = function(sequelize, DataTypes) {
    var accessToken =  sequelize.define('accessToken', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.BIGINT(11),
            allowNull: false,
            references: {
                model: 'user',
                key: 'userId'
            }
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
        },
        isExpired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        }
    }, {
        tableName: 'accessToken',
        freezeTableName: true,
        instanceMethods: {
            add: function (onSuccess, onError) {
                this.save().then(function(student){
                    onSuccess(student)
                }).catch(function(err){
                    onError(err);
                });
            }
        }
    });

    return accessToken;
};
