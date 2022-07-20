const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    //se aprovecha la información incorporada en el middleware validar-jwt.js: req.uid
    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })

}

const crearUsuario = async ( req, res = response ) => {

    //la información del body se recibe en req.body
    const { email, password, nombre } = req.body;

    try {

        const existeEmail = await Usuario.findOne( { email });
        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'No fue posible crear el usuario porque el correo ya está registrado'
            })
        }
              
        //con esto se tiene una instancia con todas las propiedades que fueron recibidas
        const usuario = new Usuario( req.body );
        
        //para encriptar el password clase 112
        //previo fue necesario instalar "npm i bcryptjs" e importar la librería
        const salt = bcrypt.genSaltSync(); //genera información aleatoria para luego utilizarla de base en el hash
        usuario.password = bcrypt.hashSync( password, salt ); //hashea el password (una sola vía)

        //se guarda el usuario en mongo y este devuelve una promesa
        await usuario.save();

        //generar el token JWT 
        const token = await generarJWT( usuario.id );
    
        //es redundante poner usuario: usuario
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
    
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        });

    }

}

const actualizarUsuario = async ( req, res = response ) => {
    //TODO validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    
    try {
        
        const usuarioDB = await Usuario.findById( uid );
        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'No fue posible actualizar el usuario porque el usuario no existe'
            })
        }
        
        // Actualizaciones
        // la información del body se recibe en req.body
        // se desestructura el password y google porque no serán actualizados como otra opción además del delete
        const { password, google, email, ...campos} = req.body;
        //sino fue modificado el email lo quitamos para que no se aplique
        //la validación de email único con el que fue creado en db
        if( usuarioDB.email != email ){//si ya existe el email en otro registro, entonces se va a manejar esa validación

            const existeEmail = await Usuario.findOne( { email: req.body.email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'No fue posible crear el usuario porque el correo ya está registrado'
                })
            }

        }

        // se borran todos los campos del objeto que no se quieren actualizar
        // Clase 114 se quitó para manejarlo por medio de la desestructuración arriba 
        /*delete campos.password;
        delete campos.google;*/

        //clase 113 {new: true} se utiliza para que retorne el objeto modificado y no el anterior
        //para así pintarlo como la respuesta indicando que fue modificado
        //quitándoselo por default muestra el anterior y dependerá de la lógica saber cuando enviar uno o el otro
        campos.email = email; // el email al ser diferente al almacenado y no existe duplicado se agrega 
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );

        //es redundante poner usuario: usuario
        res.json({
            ok: true,
            usuarioActualizado
        });
        
    } catch (error) {
    
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado en PUT usuario'
        });

    }

    
}

const borrarUsuario = async( req, res = response ) => {
    //TODO validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );
        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'No fue posible BORRAR el usuario porque el usuario no existe'
            })
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: `Usuario Eliminado`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado en DELETE usuario'
        });
    }
}
module.exports = { 
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};