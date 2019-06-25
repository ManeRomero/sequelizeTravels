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

let updateTravel = async (id, data) => {
    let update = await model.Travel.update({
        destiny: data.destiny,
        price: data.price,
        discount: data.discount,
        dateInit: data.dateInit,
        UserId: data.UserId,
        author: data.author
    }, {
        where: {
            id
        }
    })

    return update[0]
}

let deleteTravel = async (id) => {
    let delTravel = await model.Travel.destroy({
        where: {
            id
        },
        force: true // evita el problema con el atributo paranoid: true
    })
    return delTravel
}


module.exports = {
    saveTravel,
    getTravels,
    detail,
    saveMainPic,
    updateTravel,
    deleteTravel
}