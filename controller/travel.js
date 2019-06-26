const model = require('../models')

let saveTravel = (travel) => {
    return model.Travel.create(travel)
}

let getTravels = async () => {
    let travels = await model.Travel.findAll()
    let images = await model.Image.findAll()
    let mainImages = await model.MainImage.findAll()

    let arrAllImgsId = images.map(img => img.id)
    let arrAllImgPaths = images.map(img => img.path)
    let arrMainImgId = mainImages.map(main => main.ImageId)

    for (let i = 0; i < travels.length; i++) {
        let indexForPath = arrAllImgsId.indexOf(arrMainImgId[i])
        travels[i].mainImagePath = `/uploads/${arrAllImgPaths[indexForPath]}`
    }
    return travels
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
    let TravelId = id
    
    let delImage = await model.Image.destroy({
        where: {
            TravelId
        },
        force: true
    })
    
    
    let delMainImages = await model.MainImage.destroy({
        where: {
            TravelId
        },
        force: true
    })
    
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