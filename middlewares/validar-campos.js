const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {

    // Clase 111 esto se relaciona con las validaciones tipo check hechas en el "route"
    // se bloquea la llamada al controlador por medio de este middleware que acompaña
    // al resto incorporados en el "route" devolviendo un mensaje personalizado
    // con esto ya no es necesario agregar esta validación dentro de cada controlador
    // validationResult proporciona el resultado de todas las validaciones ejecutadas
    // todo esto lo deja en el objeteo request
    const errores = validationResult( req );
    if( !errores.isEmpty() ){
        return res.status(400).json({
            ok: false,
            errores: errores.mapped()
        });
    }

    //continúe con el siguiente paso = {middleware | controlador}
    next();

}

module.exports = {
    validarCampos
}