var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    nome: {type: String, required: true},
    senha: {type: String, required: true},
    email: {type: String, required: true},
    telefones: {type: [], required: true},
    token: {type: String},
    ultimo_login: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now},
});


userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('senha')) {next()}
    user.senha = passwordHash.generate(user.senha);
    next();
});


userSchema.methods.validPassword = function(senha) {
    return passwordHash.verify(senha, this.senha);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
