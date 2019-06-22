const model = require('../models')

let saveTravel = (travel) => {
    return model.Travel.create(travel)
}

let getTravels = async () => {
    let data = await model.Travel.findAll()
    return data
}

let detail = async (id) => {
    let result = await model.Travel.findByPk(id)
    return result
}

let saveMainPic = async (data) => {
    return model.MainImage.create(data)
}

module.exports = {
    saveTravel,
    getTravels,
    detail,
    saveMainPic
}