// Requires
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autentication');

//=======================================================
//Obtener Usuarios
//=======================================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Erro en base de datos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarios
            });

        });
});

//=======================================================
//Actualizar Usuario
//=======================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no encontrado',
                errors: { message: `Usuario con el id ${id} no encontrado` }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

});


//=======================================================
//Crear Usuario
//=======================================================
app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {

    var body = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync("B4c0/\/", salt);
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        usuarioGuardado.password = ':)';
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });


});

//=======================================================
//Eliminar Usuario
//=======================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario Invalido',
                errors: { message: `Usuario con el id ${id} no encontrado` }
            });
        }
        usuarioBorrado.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;