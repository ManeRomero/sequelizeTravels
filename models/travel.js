'use strict'

module.exports = (sequelize, DataTypes) => {
    var Travel = sequelize.define('Travel', {
        destiny: DataTypes.STRING,
        price: DataTypes.FLOAT,
        discount: DataTypes.INTEGER,
        author: DataTypes.STRING,
        dateInit: DataTypes.DATE,
        dateTurn: DataTypes.DATE,
    })

    Travel.associate = function (models) {
        models.Travel.belongsTo(models.User)
        models.Travel.hasMany(models.Image, {onDelete: 'cascade'})
        models.Travel.hasOne(models.MainImage, {onDelete: 'cascade'})
    }

    return Travel
}