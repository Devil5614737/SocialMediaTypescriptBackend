const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.post('/signup', async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

          
    const error=Validate(req.body);

    const newUser = new User({
        username,
        email,
        password
    })
    try {
        const existedUser = await User.findOne({
            email
        })
        if(error) return res.status(400).json(error.details[0].message);
        if (existedUser) return res.status(400).json('user already registered');
        const salt = await bcrypt.genSalt(12);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        const user = await newUser.save();
        const token = existedUser.generateAuthToken();
        res.status(200).json({user,token})

    } catch (error) {
        return res.json(error)
    }

})


function Validate(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(12).required(),
        email: Joi.string().email().min(3).required(),
        password: Joi.string().required()
    });

    const {
        error
    } = schema.validate(user);
    return error;



}




module.exports = router;