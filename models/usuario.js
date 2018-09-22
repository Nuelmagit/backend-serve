var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

const ROLES_VALIDOS = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un valor valido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: ROLES_VALIDOS },
    google: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);