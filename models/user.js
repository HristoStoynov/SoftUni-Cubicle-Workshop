const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: 'String',
        required: true,
        unique: true,
        minlength: 5,
        match: [/^[A-Za-z0-9]*$/, 'The username should be diff']
    },

    password: {
        type: 'String',
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema)