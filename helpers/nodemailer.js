const path = require('path')

codexName = () => {
    const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var resultado = ''

    for (let i = 0; i < 5; i++) {
        resultado += charList.charAt(Math.floor(Math.random() * charList.length));
    }
    return resultado
}

let transporter = {
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.join(__dirname, '../views/partials'),
        layoutsDir: path.join(__dirname, '../views/layouts'),
        defaultLayout: 'forMail',
    },
    extName: '.hbs',
    viewPath: path.join(__dirname, '/../views/email')
}

module.exports = {
    codexName,
    transporter
}