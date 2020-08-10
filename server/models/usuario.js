const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido:{
        type: String,
        required: [true, 'El apellido es necesario']
    },
    usuario:{
        type: String,
        required: [true, 'El usuario es necesario']
    },
    clave:{
        type: String,
        required: [true, 'La clave es necesaria']
    },
    rol:{
        type: String,
        required: [true, 'El rol es necesario']
    },

});


module.exports = mongoose.model('Usuario', usuarioSchema);