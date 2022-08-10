/*
    Ruta: /api/uploads/
*/

const { Router, application  } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');

const router = Router();

router.use( expressFileUpload() );

router.put( '/:tipo/:id', validarJWT, fileUpload );

router.get( '/:tipo/:img', retornaImagen );

module.exports = router;