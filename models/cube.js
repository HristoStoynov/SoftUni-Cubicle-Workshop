const mongoose = require('mongoose')

const CubeSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
        minlength: 5,
        match: [/^[A-Za-z][ ][A-Za-z0-9]*$/, 'The Name should be diff']
    },

    description: {
        type: 'String',
        required: true,
        maxlength: 400,
        minlength: 20,
        match: [/^[A-Za-z][ ][A-Za-z0-9]*$/, 'The Desc should be diff']
    },

    imageUrl: {
        type: 'String',
        required: true,
        match: /^https?:/
    },

    difficulty: {
        type: 'Number',
        required: true,
        min: 1,
        max: 6
    }
})

module.exports = mongoose.model('Cube', CubeSchema)