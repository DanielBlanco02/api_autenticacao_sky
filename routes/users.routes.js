let Model = require('../models/user.model');
const config = require('../config');
const jwt = require('jsonwebtoken');

exports.signin = async function(req, res, next) {


    let email = req.body.email.toLowerCase();

    let user = await Model.findOne({email: email});

    if(!user){
        return res.status(404).send('usuario/senha invalidos')
    }
    if(!user.validPassword(req.body.senha)){
        return res.status(401).send('usuario/senha invalidos')
    }

    var token = await generateToken(user._id);
    await Model.findOneAndUpdate({_id: user._id}, {token: token, ultimo_login: new Date()});

    user = user.toObject();
    delete user.senha;
    user.token = token;

    return res.send(user)

};



exports.signup = async function(req, res, next) {
    try {


        let userExist = await Model.findOne({email: req.body.email});

        if(userExist){
            return res.status(401).send('Email ja existente')
        }


        let user = new Model(req.body);
        let savedUser = await user.save();


        // savedUser = savedUser.toObject();
        // await delete savedUser.senha;

        var token = await generateToken(user._id);
        let updatedUser = await Model.findOneAndUpdate({_id: user._id}, {token: token, ultimo_login: new Date()}, {returnNewDocument: true});

        updatedUser = updatedUser.toObject();
        delete updatedUser.senha;
        updatedUser.token = token;

        return res.send(updatedUser)

    } catch (e) {
        console.log('error', e)

    }
};


exports.usuario = async function(req, res, next) {
    try {

        let userId = req.userId;

        let user = await Model.findOne({_id: userId});

        if(user.token !== req.token){
            return res.status(401).send('Nao autorizado')
        }

        var diff = Math.abs(user.ultimo_login - new Date());
        var minutesDiff = Math.floor((diff/1000)/60);

        if(minutesDiff > 30){
            return res.status(401).send('Sessao invalida')
        }

        user = user.toObject();
        delete user.senha;


        return res.send(user)

    } catch (e) {
        console.log('error', e)

    }
};


let generateToken = async (id) => {

    var token = jwt.sign({ id }, config.secret, {
        expiresIn: 3600 // expires in 30min
    });

    return token
}