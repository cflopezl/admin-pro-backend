
//modelo de Mongoose

const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

}, { collection: 'hospitales' });

//Se utiliza una function() normal para que this tenga acceso al objeto creado, 
//a diferencia de una función de flecha que apunta afuera a lo que apunta el mismo
//esto se ejecuta si deserializan al utilizar un objeto Json
HospitalSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;
})

//por default Mongoose lo colocará en plural "Usuarios"
module.exports = model('Hospital', HospitalSchema );