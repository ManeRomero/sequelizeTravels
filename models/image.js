'use strict'

module.exports = (sequelize, DataTypes) => {
    var Image = sequelize.define('Image', {
        path: DataTypes.STRING
    })

    Image.associate = function (models) {
        models.Image.belongsTo(models.Travel)
    }

    return Image
}