'use strict'

//Aquí van los modulos de node para crear el servidor

let express = require('express');


// Aquí se ejecuta express (http)

let app = express();

//Cargar ficheros rutas

let article_routes = require('./routes/article');


//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Añadir prefijos a routas

app.use('/api', article_routes);


// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Ruta o método de prueba

/*
app.get('/probando', ( req, res ) => {
        return res.status(200).send({
            nombre: "Diego",
            apellido: "Reyes",
            apodo: "Shoegazer",
        });
})
*/


//Exportar el modulo
module.exports = app;