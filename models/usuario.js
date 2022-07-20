
//modelo de Mongoose

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false,
    },

});

//Se utiliza una function() normal para que this tenga acceso al objeto creado, 
//a diferencia de una función de flecha que apunta afuera a lo que apunta el mismo
//esto se ejecuta si deserializan al utilizar un objeto Json
UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

//por default Mongoose lo colocará en plural "Usuarios"
module.exports = model('Usuario', UsuarioSchema );