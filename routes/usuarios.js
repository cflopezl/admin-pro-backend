/*
    Ruta: /api/usuarios
*/

const { Router  } = require('express');
const { check } = require('express-validator')
const { getUsuarios,crearUsuario,actualizarUsuario,borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT,  getUsuarios );

//Clase 110 este path incorpora un mecanismo de validación de datos
//para esto es necesario instalar npm i express-validator
//y utilizar la librería const { check } = require('express-validator')
//la configuración se hace por medio de un arreglo de middlewares, cuando solo se invoca uno no es necesario el arreglo
//Clase 111 este se complementa creando un middleware personalizado en middlewares/validar-campos.js 
router.post(     
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearUsuario 
);


router.put( 
    '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],    
    actualizarUsuario 
);

router.delete( 
    '/:id',  
    validarJWT,
    borrarUsuario 
);


module.exports = router;