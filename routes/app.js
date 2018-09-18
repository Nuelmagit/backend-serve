// Requires
var express = require('express');
var app = express();


// Rutas:
app.get('/', (req, res, next) => {
    res.status(200).json({
        'data': 'wok',
        'mensaje': 'true'
    });
});


module.exports = app;