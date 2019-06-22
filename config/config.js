'use strict'

module.exports = {
    development: {
        username: "MRCtravels",
        database: "sequelizetravels",
        dialect: "mysql",
        password: '1234travels',
        host: 'localhost'
    },
    test: {
        dialect: "mysql",
        storage: ":memory:"
    },
    production: {
        username: 'MRCmusic',
        database: 'sequelizetravels',
        dialect: 'mysql',
        use_env_variable: 'DATABASE_URL'
    }
}