const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Post = require('../models/post');
const User = require('../models/user');


// uploading image

router.post('/post', auth, async (req, res) => {
    const {
        caption,
        photo
    } = req.body;
    const newPost = new Post({
        caption,
        photo,
        postedBy: req.user
    });

    try {
        const post = await newPost.save();
        res.status(200).json(post);

    } catch (e) {
        console.log(e);
    }


});


// fetching all posts
router.get('/allPost', auth, async (req, res) => {
    const posts = await Post.find().populate('postedBy', '_id username  pic').populate("comments.postedBy", "_id username pic")
    try {
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json(error);
    };

});


// commenting on post
router.put('/comment', auth, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
            $push: {
                comments: comment
            }
        }, {
            new: true
        }).populate("comments.postedBy", "_id username")
        .populate("postedBy", "_id username").exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    error: err
                })
            } else {
                res.json(result)
            }
        })
})


// like a post
router.put('/like', auth, async (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})


// unlike a post


router.put('/unLike', auth, async (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})


// user post

router.get("/myPost", auth, (req, res) => {
    Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .then((mypost) => {
        res.json({ mypost });
      })
      .catch((err) => {
        console.log(err);
      });
  });

// removing a post
router.delete("/removePost", auth, (req, res) => {
    Post.findByIdAndDelete(req.body.postId, {
      new: true,
    }).exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
  });


// find users

router.get('/', auth, async (req, res) => {
    const keyword = req.query.search ? {
        $or: [{
                username: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: req.query.search,
                    $options: 'i'
                }
            }
        ]
    } : {}
    const user = await User.find(keyword).find({
        _id: {
            $ne: req.user._id
        }
    })
    return res.json(user)
})



// allUsers/
router.get('/users',auth,async(req,res)=>{
    const users=await User.find({
        _id:{
            $ne:req.user._id
        }
    })
    return res.json(users)
})


// adding friend

router.put("/addFriend", auth, (req, res) => {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: {
          friends: req.user._id,
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $push: {
              friends: req.body.userId,
            },
          },
          {
            new: true,
          }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({
              error: err,
            });
          });
      }
    );
  });
  
  // unfollow a user
  router.put("/unFriend", auth, (req, res) => {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: {
          friends: req.user._id,
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({
            error: err,
          });
        }
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: {
              friends: req.body.userId,
            },
          },
          {
            new: true,
          }
        )
          .select("-password")
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({
              error: err,
            });
          });
      }
    );
  });






router.get('/me',auth,async(req,res)=>{
  try{
    const user=await User.findById(req.user._id).select('-password')
    res.status(200).json(user)

  }catch(e){
    res.status(400).send(e)
  }
})



// updating  username

router.put('/updateUsername',auth,async(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{
  $set:{username:req.body.username,pic:req.body.pic}
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  })
})



module.exports = router;