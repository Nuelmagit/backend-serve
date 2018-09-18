var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


app.post('/', (req, res, next) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'login error',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales invalidas',
                errors: { message: `Usuario ${body.email} es invalido` }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensje: 'Credencial Invalida',
                errors: { message: `Credencial Invalida` }
            });
        }

        //Crear TOKEN params: payload - semilla
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            mensaje: 'ok',
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token
        });
    });

});

module.exports = app;