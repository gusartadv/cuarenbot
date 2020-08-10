const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let pedidoSchema = new Schema({
    idUsuario:{
        type: String,
        required: [true, 'El idUsuario es necesario']
    },
    idConversacion:{
        type: String,
        required: [true, 'El idConversacion es necesario']
    },
    contenido:{
        type: String,
        required: [true, 'El contenido es necesario']
    },
    direccion:{
        type: String,
        required: [true, 'La direccion es necesaria']
    },

});

module.exports = mongoose.model('Pedido', pedidoSchema);