'use strict'

module.exports = (sequelize, DataTypes) => {
    var Hash = sequelize.define('Hash', {
        code: DataTypes.STRING
    })

    Hash.associate = function (models) {
        models.Hash.belongsTo(models.User)
    }

    return Hash
}