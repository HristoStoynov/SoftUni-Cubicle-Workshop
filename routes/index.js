const { Router } = require('express')
const { getAllCubes, getCube, updateCube, deleteOne } = require('../controllers/cubes')
const Cube = require('../models/cube')
const { checkGuestUser, checkLoggedUser, userStatus } = require('../controllers/users.js')

const router = Router()

router.get('/', userStatus, async (req, res) => {
    const cubes = await getAllCubes()

    res.render('index', {
        title: 'Cube Workshop',
        cubes,
        auth: req.auth
    })
})

router.get('/login', checkLoggedUser, userStatus, (req, res) => {
    res.render('loginPage', {
        title: 'Login | Cube Workshop',
        auth: req.auth
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('aid')

    res.redirect('/')
})

router.get('/register', checkLoggedUser, userStatus, (req, res) => {
    res.render('registerPage', {
        title: 'Register | Cube Workshop',
        auth: req.auth
    })
})

router.get('/about', userStatus, (req, res) => {
    res.render('about', {
        title: 'About | Cube Workshop',
        auth: req.auth
    })
})


router.get('/create', checkGuestUser, userStatus, function (req, res) {
    res.render('create', {
        title: 'Create | Cube Workshop',
        auth: req.auth
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

router.get(`/details/:id`, userStatus, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('details', {
        title: 'Details | Cube Workshop',
        ...cube,
        auth: req.auth
    })
})

router.get('/edit/:id', checkGuestUser, userStatus, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('editCubePage', {
        title: 'Edit | Cube Workshop',
        ...cube,
        auth: req.auth
    })
})

router.post('/edit/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    updateCube(req.params.id)
    res.redirect('/')
})


router.get('/delete/:id', checkGuestUser, userStatus, async (req, res) => {
    const cube = await getCube(req.params.id)

    res.render('deleteCubePage', {
        title: 'Delete | Cube Workshop',
        ...cube,
        auth: req.auth
    })
})

router.post('/delete/:id', async (req, res) => {
    const cube = await getCube(req.params.id)

    deleteOne(req.params.id)
    res.redirect('/')
})

router.get('*', userStatus, (req, res) => {
    res.render('404', {
        title: 'Error | Cube Workshop',
        auth: req.auth
    })
})

module.exports = router