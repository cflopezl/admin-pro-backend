const jwt = require('jsonwebtoken');

//Clase 117 para generar JWT es necesario instalar npm i jsonwebtoken
const generarJWT = ( uid ) => {

    return new Promise( ( resolve, reject ) => {
        
        const payload = {
            uid
        };
    
        //es para crearlo
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, 
        ( err, token )=>{
            
            if( err ){
                console.log(err);
                reject( 'No se generó el JWT: ${err}' );
            }else{
                resolve( token );
            }
            
        });
    
    });

}

module.exports = {
    generarJWT,
}