//por defecto lee las variables de entorno del archivo .env y los establece en node
//utilizando por medio de process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');

//crear el servidor de express
const app = express();

//es necesario instalar el paquete npm i cors, 
//el paquete es utilizado para que se acepten peticiones de diferentes dominios (el error es cross-origin domain ...)
//"use" se utiliza para configurar un middelware
app.use( cors() );

//base de datos
dbConnection();

//se utiliza otro middleware para el manejo de información de entrada al API
//lectura y parseo del body
app.use( express.json() );

// Rutas
// Para el manejo de las rutas se utilizará un middleware
// en esta instrucción se indica que cualquier petición a /api/usuarios la maneja el coponente que es requerido
// de esta forma queda más simple y ordenado el controlador 
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));


/* Ejemplo de como sería sino se separan las rutas 
app.get( '/api/usuarios', (req, res) => {

    res.json({
        ok: true,
        usuarios: [
            {
                id: 123,
                nombre: 'Chris',
            },
            {
                id: 456,
                nombre: 'Fer',
            }
        ]
    });

} );*/

app.listen( process.env.PORT, () => {
    console.log('servidor corriedo en puerto 3K');
} );