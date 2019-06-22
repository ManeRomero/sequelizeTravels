'use strict'

module.exports = (sequelize, DataTypes) => {
    var MainImage = sequelize.define('MainImage', {
        
    })

    MainImage.associate = function (models) {
        models.MainImage.belongsTo(models.Travel)
        models.MainImage.belongsTo(models.Image)
    }

    return MainImage
}