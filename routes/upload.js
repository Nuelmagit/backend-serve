// Requires
var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var fs = require('fs');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
// Rutas:
app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo invalido',
            erros: { message: ` el tipo ${tipo} no es valido` }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'sin archivos',
            erros: { message: "Seleccione una imagen" }
        });
    }

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var ext = nombreCortado[nombreCortado.length - 1];

    var extValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValidas.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'etencion no valida',
            erros: { message: "Extenciones permitidas son: " + extValidas.join(', ') }
        });
    }

    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${ext}`;

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error moviendo el archivo',
                erros: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'medicos') {
        var modelo = Medico;
        var entidad_key = 'medico';
    }
    if (tipo === 'hospitales') {
        var modelo = Hospital;
        var entidad_key = 'hospital';
    }
    if (tipo === 'usuarios') {
        var modelo = Usuario;
        var entidad_key = 'usuario';
    }

    modelo.findById(id, (err, entidad) => {

        if (!entidad) {
            return res.status(400).json({
                ok: false,
                mensaje: ` ${entidad_key} no encontrada`,
                erros: { message: `ǹo hay ${tipo} con ese id` }
            });
        }
        var pathViejo = `./uploads/${tipo}/` + entidad.img;

        if (fs.existsSync(pathViejo)) {
            fs.unlink(pathViejo, err => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error eliminando el archivo viejo',
                        erros: err
                    });
                }
            });
        }

        entidad.img = nombreArchivo;

        entidad.save((err, entidadActualizado) => {
            return res.status(200).json({
                ok: true,
                mensaje: 'imagen actualizada',
                [entidad_key]: entidadActualizado
            });
        });


    });
}
module.exports = app;