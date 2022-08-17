const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res=response ) => {

    try {

        const { email, password } = req.body;

        const usuarioDB = await Usuario.findOne({ email });

        // verificar email
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido'
            })
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }

        //generar el token JWT 
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error en auth Controller'
        })
    }

}

const googleSignIn = async( req, res=response ) => {

    try {
        // validación del token de google desde el lado del server
        // clase 146 npm install google-auth-library --save
        const { email, name, picture } = await googleVerify( req.body.token );     
        
        const usuarioDB = await Usuario.findOne({ email }); 
        let usuario;

        // verificar email
        if( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        //generar el token JWT 
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            email, name, picture, 
            token
        });      
        
    } catch (error) {

        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'token de google incorrecto'
        });
        
    }

}

const renewToken = async (req, res) => {

    const uid = req.uid;

    //generar el token JWT 
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token

    })

}

module.exports = {
    login,googleSignIn,renewToken
}