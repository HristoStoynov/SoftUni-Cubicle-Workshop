module.exports = {
    development: {
        port: process.env.PORT || 5000,
        databaseURL: `mongodb+srv://HStoynov:dbPassIc0@cluster0-wutse.mongodb.net/cubicle?retryWrites=true&w=majority`
    },
    production: {}
}