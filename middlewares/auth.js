const jwt = require('jsonwebtoken');


function auth(req, res, next) {

    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).send('access denied no token provided')
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

    } catch (error) {
        res.status(400).send('Invalid token...')
    }


}


module.exports = auth;