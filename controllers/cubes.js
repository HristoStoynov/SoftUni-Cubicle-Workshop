const Cube = require('../models/cube.js')

const getAllCubes = async () => {
    const cubes = await Cube.find().lean()
    return cubes
}

const getCube = async (id) => {
    const cube = await Cube.findById(id).lean()
    return cube
}

const updateCube = async (id) => {
    try {
        await Cube.findByIdAndUpdate(id)
    } catch (err) {
        return err
    }
}

const deleteOne = async (id) => {
    try {
        await Cube.findByIdAndDelete(id)
    } catch (err) {
        return err
    }
}

module.exports = {
    getAllCubes,
    getCube,
    updateCube,
    deleteOne
}