var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autentication');
var Hosptal = require('../models/hospital');


app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = new Number(desde);
    Hosptal.find({}, 'nombre img usuario')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de DB',
                    errors: err
                });
            }

            Hosptal.count({}, (err, total) => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    desde,
                    total
                });
            });

        });
});

app.post('/', mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body
    var hospital = new Hosptal({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDb) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalDb
        });
    });


});

app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var body = req.body;
    var id = req.params.id;
    Hosptal.findById(id, (err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error de base de datos",
                errors: err
            });
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: "Hospital no Encontrado",
                errors: { message: `Hospital con el id ${id} no encontrado` }
            });
        }

        hospitalDB.nombre = body.nombre;
        hospitalDB.img = body.img;
        hospitalDB.usuario = req.usuario._id;

        hospitalDB.save((err, hositalUpdated) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error de DB',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hositalUpdated
            });
        });

    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Hosptal.findByIdAndRemove(id, (err, hospitalDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de DB',
                errors: err
            });
        }

        if (!hospitalDelete) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital Invalido',
                errors: { message: `Hospital con el id ${id} no encontrado` }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDelete
        });
    });

});

module.exports = app;