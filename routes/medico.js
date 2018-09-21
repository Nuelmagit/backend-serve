var mongoose = require('mongoose');
var express = require('express');
var app = express();
var Medico = require('../models/medico');
var mdAutentication = require('../middlewares/autentication');

app.get('/', mdAutentication.verificaToken, (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = new Number(desde);
    Medico.find({}, 'nombre img usuario hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de DB',
                    errors: err
                });
            }

            Medico.count({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error de DB',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    medicos,
                    desde,
                    total
                });
            });


        });
});

app.post('/', mdAutentication.verificaToken, (req, res, next) => {
    var body = req.body
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de DB',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });
    });


});

app.put('/:id', mdAutentication.verificaToken, (req, res, next) => {
    var body = req.body;
    var id = req.params.id;

    Medico.findById(id, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de DB',
                errors: err
            });
        }
        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico no encontrado',
                errors: { message: `MEdico con el id ${id} no encontrado` }
            });
        }

        medicoDB.nombre = body.nombre
        medicoDB.img = body.img
        medicoDB.usuario = body.usuario
        medicoDB.hospital = body.hospital

        medicoDB.save((err, medicoUpdated) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de DB',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoUpdated
            });
        });


    });
});

app.delete('/:id', mdAutentication.verificaToken, (req, res, next) => {
    var body = req.body;
    var id = req.params.id
    Medico.findByIdAndRemove(id, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de DB',
                errors: err
            });
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico no encontrado',
                errors: { message: `MEdico con el id ${id} no encontrado` }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });
    });
});


module.exports = app;