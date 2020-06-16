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

    bcrypt.compare(password, thisuser.password, (err, result) => {
        if (result) {
            const token = jwt.sign({
                userId: thisuser._id,
                username: thisuser.username
            }, config.privateKey)

            res.cookie('aid', token)

            res.redirect('/')
        } else {
            console.error(err)
        }
    })
})

router.post('/register', (req, res) => {
    const {
        username,
        password,
        repeatPassword
    } = req.body

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
    }

})

module.exports = router