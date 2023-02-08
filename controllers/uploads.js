const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const fileUpload = async (req, res) => {
    
    const tipo = req.params.tipo;
    const id = req.params.id;

    // validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)',
        })
    }

    // para recibir y procesar el archivo es necesario instalar npm i express-fileupload en las rutas como middleware
    // se valida que exista un archivo
    if( !req.files || Object.keys(req.files).length === 0 ){
        return res.status(400).json({
            ok: false,
            msg: 'No hay archivos adjuntos para subir',
        })
    }

    // procesar la imagen, se llama imagen porque así fue como se coloca en el cliente 
    const file = req.files.imagen;

    // extraer el nombre del archivo
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length-1 ];

    // validar extensión
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if( !extensionesValidas.includes(extensionArchivo) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida ',
        })
    }

    // generar el nombre del archivo por medio de uuid, necesario npm i uuid e import en este archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`

    // mover la imagen
    file.mv( path, (err) => {
        if( err ){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover el archivo',
            })
        }

        // actualizar DB
        if( !actualizarImagen( tipo, id, nombreArchivo ) ){
            return res.status(400).json({
                ok: false,
                msg: 'Error al actualizar la imagen en la db',
            })
        }

        res.json({
            ok: true,
            msg: 'Archivo subido',
            path,
            nombreArchivo
        });
    });

}

const retornaImagen = async (req, res = response) => {
    
    const tipo = req.params.tipo;
    const img = req.params.img;

    // clase 138. path es una librería de node que sirve para construir un path completo
    // __dirname es la dirección donde está la aplicación desplegada y se le concatena el path 
    let pathImg = path.join( __dirname, `../uploads/${ tipo }/${ img }` );

    // imagen por defecto para cuando el path no exista
    if( !fs.existsSync(pathImg) ){
        pathImg = path.join( __dirname, `../uploads/noimage612x612.jpg` );
    }
    
    // para que el api(response) no responda un json sino un archivo:
    res.sendFile( pathImg );
    
}    

module.exports = {
    fileUpload,
    retornaImagen
}