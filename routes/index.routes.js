var fileupload = require("express-fileupload");
var jwt = require('jsonwebtoken');
var config = require('../config');

// Controllers

var user = require('./users.routes');

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

function verifyJWT(req, res, next){

    let token = extractToken(req);

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    req.token = token;
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

module.exports = function(app) {

    app.post('/usuarios/signin', user.signin);
    app.post('/usuarios/signup', user.signup);

    app.get('/usuario', verifyJWT, user.usuario);

};
