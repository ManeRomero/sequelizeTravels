const model = require('../models')

let managePics = async (req, TravelId) => {
    let files = req.files
    let arrData = files.map((pic) => {
        return {
            path: pic.filename,
            TravelId
        }
    })

    let save = await model.Image.bulkCreate(arrData)
    return save
}

let getMainImgs = async () => {
    let data = await model.MainImage.findAll()
    return data
}

let setMainPics = async (travels) => {
    let mainImgs = await getMainImgs()

    for (let i = 0; i < travels.length; i++) {
        travels[i].id === mainImgs[i].TravelId ?
            travels[i].mainPic = mainImgs[i].ImageId :
            travels[i].mainPic = ''
    }

    return travels
}

let setMainImgPaths = async (travels) => {
    let pathIds = travels.map(travel => travel.mainPic)
    let result = []

    console.log(result, 'C C C C C C');

    /* for (let i = 0; i < pathIds.length; i++) {
        travels[i].mainPath = await model.Image.findOne({
            where: {
                id: pathIds[i]
            }
        }).path
    } */

    // console.log(pathIds, 'c LLLL L L L');
}

let getImagesById = async (id) => {
    let data = await model.Image.findAll({
        where: {TravelId: id}
    })

    let results = data.map(image => image)
    console.log(results);
    return results 
}

module.exports = {
    managePics,
    getMainImgs,
    setMainPics,
    setMainImgPaths,
    getImagesById
}