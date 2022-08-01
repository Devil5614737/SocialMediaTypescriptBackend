const Joi=require('joi');
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

const error=Validate(req.body);
if(error) return res.status(400).json(error.details[0].message)

    try {
        const user = await User.findOne({
            email
        });
        if (!user) return res.status(400).json('invalid credentials');
        let auth=await bcrypt.compare(password,user.password);
        const token = user.generateAuthToken();
        if(auth){
            return res.status(200).json({user,token});
        }else{
            return res.status(400).json('invalid credentials');
        }


    } catch (error) {
        return res.json(error)
    }

})


function Validate(user) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).required(),
        password: Joi.string().required()
    });

    const {
        error
    } = schema.validate(user);
    return error;



}




module.exports = router;