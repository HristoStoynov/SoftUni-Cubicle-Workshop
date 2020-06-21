const env = process.env.NODE_ENV || 'development'

const config = require('../config/config.js')[env]
const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { checkUser } = require('../controllers/users.js')

const router = Router()

router.post('/login', async (req, res) => {
    const {
        username,
        password,
    } = req.body

    const thisuser = await User.findOne({ username })


    try {
        bcrypt.compare(password, thisuser.password, (err, result) => {
            if (result) {
                const token = jwt.sign({
                    userId: thisuser._id,
                    username: thisuser.username
                }, config.privateKey)

                res.cookie('aid', token)

                res.redirect('/')
            } else {
                res.render('loginPage', {
                    title: 'Login | Cube Workshop',
                    auth: req.auth,
                    message: "Your password is wrong boy!"
                })
            }
        })
    } catch (err) {
        res.render('loginPage', {
            title: 'Login | Cube Workshop',
            auth: req.auth,
            message: "Your username is wrong boy!"
        })
    }
})

router.post('/register', (req, res) => {
    const {
        username,
        password,
        repeatPassword
    } = req.body

    try {
        if (!password || password.length < 8 || !password.match(/^[A-Za-z0-9]*$/)) {
            res.render('registerPage', {
                title: 'Register | Cube Workshop',
                auth: req.auth,
                message: "Your password is not cool enough boy!"
            })
        }

        if (repeatPassword === password) {
            bcrypt.genSalt(10, async (err, salt) => {
                const hashedPassword = await bcrypt.hashSync(password, salt)

                const user = await new User({ username, password: hashedPassword })

                const data = await user.save()

                const token = jwt.sign({
                    userId: data._id,
                    username: data.username
                }, config.privateKey)

                res.cookie('aid', token)

                return res.redirect('/')
            })
        } else {
            res.render('registerPage', {
                title: 'Register | Cube Workshop',
                auth: req.auth,
                message: "Your passwords don't match boy!"
            })
        }
    } catch (err) {
        res.render('registerPage', {
            title: 'Register | Cube Workshop',
            auth: req.auth,
            message: "Your username is bad boy!"
        })
    }
})

module.exports = router