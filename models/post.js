const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
    },
    photo: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;