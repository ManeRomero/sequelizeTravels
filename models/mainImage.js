'use strict'

module.exports = (sequelize, DataTypes) => {
    var MainImage = sequelize.define('MainImage', {        
    })

    MainImage.associate = function (models) {
        models.MainImage.belongsTo(models.Travel, {onDelete: 'cascade'})
        models.MainImage.belongsTo(models.Image, {onDelete: 'cascade'})
    }

    return MainImage
}