const env = process.env.NODE_ENV || 'development'

const express = require('express')
const mongoose = require('mongoose')
const config = require('./config/config.js')[env]
const app = express()
const indexRouter = require('./routes')

mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.error(err)
        throw err
    }

    console.log('Database is setup and running')
})


require('./config/express')(app)

app.use('/', indexRouter)

app.listen(config.port, console.log('here am i'))