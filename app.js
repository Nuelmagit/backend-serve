// Requires
var express = require('express');
var mongoose = require('mongoose');

//iniciar

var app = express();

// Rutas:
app.get('/', (req, res, next) => {
    return res.status(200).json({ 'data': 'ok' });
});

//DB CONECT
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('DB status: \x1b[32m%s\x1b[0m', 'online');
});


//listenn
app.listen(4200, () => {
    console.log('server en el puerto 300: \x1b[32m%s\x1b[0m', 'online');
});