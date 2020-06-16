require('dotenv').config();

module.exports = {
    development: {
        port: process.env.PORT,
        databaseURL: process.env.DB_URL,
        privateKey: process.env.DB_KEY
    },
    production: {}
}