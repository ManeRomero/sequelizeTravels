'use strict'

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    })

    User.associate = function (models) {
        models.User.hasMany(models.Travel)
        models.User.hasOne(models.Hash)
    }

    return User
}