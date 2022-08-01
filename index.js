const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const signup=require('./routes/signup');
const login=require('./routes/login');
const post=require('./routes/post');


dotenv.config({
    path: './.env'
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.URI,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log('Successfully connected to mongodb')).catch(error=>console.log(error))




app.use('/api',signup);
app.use('/api',login);
app.use('/api',post);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});