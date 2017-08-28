// in this file we're gonna setup the authentication middleware
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60 * 60 * 24 * 30; // 30 days: token time
const SECRET = "W3 Hav3 th3 kn0w h0w"; // can be whatever you want but you need to guard it

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
    //when you see the 'next' it's usually a sign indicating that's middleware
    req.token = req.token || {};
    req.token = jwt.sign({
        id: req.user.id
    }, SECRET, {
        expiresIn: TOKENTIME // 30 days
    });
    next();
}

let respond = (req, res) => {
    res.status(200).json({
        user: req.user.username, 
        token: req.token
    });
}

module.exports = {
    authenticate, 
    generateAccessToken, 
    respond
} // ES6 Syntax 


