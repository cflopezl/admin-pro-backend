const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}