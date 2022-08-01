const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pic: {
        type: String,
        default: 'https://images.unsplash.com/photo-1621285853634-713b8dd6b5fd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGxhbWJvcmdoaW5pfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    }
});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id
    }, process.env.SECRET_KEY);
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;