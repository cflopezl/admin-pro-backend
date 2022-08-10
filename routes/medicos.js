/*
    Ruta: /api/hospitales
*/

const { Router  } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos,crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos );

router.post( '/', [
        validarJWT,
        check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
        check('hospital', 'El id del hospital es necesario y válido').isMongoId(),//con esto ya podremos validar la existencia del id en la base de datos para que no de error al hacer esto
        validarCampos,
    ], 
    crearMedico );

router.put( '/:id', [], actualizarMedico );

router.delete( '/:id', [], borrarMedico );

module.exports = router;