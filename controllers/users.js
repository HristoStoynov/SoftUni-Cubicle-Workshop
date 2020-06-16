const env = process.env.NODE_ENV || 'development'

const User = require('../models/user.js')
const { models } = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('../config/config.js')[env]

const checkGuestUser = (req, res, next) => {
    const token = req.cookies['aid']
    if (!token) {
        return res.redirect('/')
    }

    try {
        const decodedObject = jwt.verify(token, config.privateKey)
        next()
    } catch (err) {
        return res.redirect('/')
    }
}

const checkLoggedUser = (req, res, next) => {
    const token = req.cookies['aid']
    if (token) {
        return res.redirect('/')
    }

    next()
}

const userStatus = (req, res, next) => {
    const token = req.cookies['aid']
    if (!token) {
        req.auth = false
    }

    try {
        jwt.verify(token, config.privateKey)
        req.auth = true
    } catch (err) {
        req.auth = false
    }

    next()
}

module.exports = {
    checkGuestUser,
    checkLoggedUser,
    userStatus
}