const { Router } = require('express')
const { getAllCubes, getCube, updateCube, deleteOne } = require('../controllers/cubes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = 'MY-KEY'
const Cube = require('../models/cube')
const User = require('../models/user')
const { checkUser } = require('../controllers/users.js')

const router = Router()

router.get('/', async (req, res) => {
    const cubes = await getAllCubes()

    const auth = checkUser(req, res)

    res.render('index', {
        title: 'Cube Workshop',
        cubes
    })
})

router.get('/create', function (req, res) {
    res.render('create', {
        title: 'Create | Cube Workshop'
    })
})

router.post('/create', (req, res) => {
    const {
        name,
        description,
        imageUrl,
        difficultyLevel
    } = req.body

    const cube = new Cube({ name, description, imageUrl, difficulty: difficultyLevel })

    cube.save((err) => {
        if (err) {
            console.log(err)
            res.redirect('/create')
        } else {
            res.redirect('/')
        }
    })
})

router.get(`/details/:id`, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('details', {
        title: 'Details | Cube Workshop',
        ...cube
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop'
    })
})

router.get('/login', (req, res) => {
    res.render('loginPage')
})

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
            }, privateKey)

            res.cookie('aid', token)

            res.redirect('/')
        } else {
            console.error(err)
        }
    })
})

router.get('/register', (req, res) => {
    res.render('registerPage')
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
            }, privateKey)

            res.cookie('aid', token)

            return res.redirect('/')
        })
    }

})

router.get('/edit/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('editCubePage', {
        title: 'Edit | Cube Workshop',
        ...cube
    })
})

router.post('/edit/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    updateCube(req.params.id)
    res.redirect('/')
})


router.get('/delete/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('deleteCubePage', {
        title: 'Delete | Cube Workshop',
        ...cube
    })
})

router.post('/delete/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    deleteOne(req.params.id)
    res.redirect('/')
})

router.get('*', (req, res) => {
    res.render('404', {
        title: 'Error | Cube Workshop'
    })
})

module.exports = router