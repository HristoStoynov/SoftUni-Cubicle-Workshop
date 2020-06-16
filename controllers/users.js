const User = require('../models/user.js')
const { models } = require('mongoose')

const checkUser = async (req, res, next) => {
    const aid = req.cookies['aid']

    if (aid !== undefined) {
        return true
    }

    next()
}

module.exports = {
    checkUser
}