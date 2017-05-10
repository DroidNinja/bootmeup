'use strict';

/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			userId: {
				type: DataTypes.BIGINT(11),
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'entity',
					key: 'entityId'
				}
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
			userType: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'USER'
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
			nationality:{
				type: DataTypes.STRING,
				allowNull: true
			},
			countryCode:{
				type: DataTypes.STRING,
				allowNull: true
			},
			fbId:{
				type: DataTypes.STRING,
				allowNull: true
			},
			fbToken:{
				type: DataTypes.TEXT,
				allowNull: true
			},
			googleId:{
				type: DataTypes.STRING,
				allowNull: true
			},
			googleToken:{
				type: DataTypes.TEXT,
				allowNull: true
			},
			pictureUrl: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: ""
			},
			coverUrl: {
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
