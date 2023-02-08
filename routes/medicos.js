/*
Ruta: /api/medicos
*/

const { Router  } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos,crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos );

router.get( '/:id', validarJWT, getMedicoById );

router.post( '/', [
        validarJWT,
        check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
        check('hospital', 'El id del hospital es necesario y válido').isMongoId(),//con esto ya podremos validar la existencia del id en la base de datos para que no de error al hacer esto
        validarCampos,
    ], 
    crearMedico );

router.put( '/:id', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El id del hospital es necesario y válido').isMongoId(),//con esto ya podremos validar la existencia del id en la base de datos para que no de error al hacer esto
    validarCampos,
    ], 
    actualizarMedico );

router.delete( '/:id', validarJWT, borrarMedico );

module.exports = router;