'use strict';

/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			userId: {
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true,
				autoincrement: true
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: ''
			},
			email:{
				type: DataTypes.STRING(191),
				allowNull: false,
				unique: true
			},
			gender: {
				type: DataTypes.ENUM('MALE','FEMALE','OTHERS'),
				allowNull: false,
				defaultValue: 'OTHERS'
			},
			fbId:{
				type: DataTypes.STRING,
				allowNull: false
			},
			accessToken:{
				type: DataTypes.TEXT,
				allowNull: false
			},
			pictureUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ""
			},
			hashedPassword: {
				type: DataTypes.STRING,
				allowNull: true
			},
			salt: {
				type: DataTypes.STRING,
				allowNull: true
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: '0'
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}
		},
		{
			tableName: 'user',
			freezeTableName: true,
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.hashedPassword;
					delete values.salt;
					return values;
				},
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) {
                        return '';
                    }
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				}
			},
			associate: function(models) {
			}
		}
	);

	return User;
};
