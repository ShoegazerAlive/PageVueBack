'use strict'

let mongoose = require('mongoose');
let app = require('./App');
let port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/usuarios', { useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log("La conexión se ha realizado");

                // Crear servidor para escuchar peticiones HTTP
                app.listen(port, () => {
                    console.log("El servidor está corriendo en el puerto " + port)
                })


                })