const express = require('express')
const app = express()
const Pedido = require('../models/pedido');

//path para obtener los pedidos por idUsuario
app.get('/api/pedido/:idUsuario', function (req, res) {

    let id = req.params.idUsuario;
    
    Pedido.findOne({ idUsuario: id })
        .exec( (err, pedidos) => {

            if ( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pedidos
            });

        } )

})
   
//path para la creacion de pedidos
app.post('/api/pedido', function (req, res) {
  
  let body = req.body;

  let pedido = new Pedido({
    idUsuario: body.idUsuario,
    idConversacion: body.idConversacion,
    contenido: body.contenido,
    direccion: body.direccion
  });

  pedido.save((err, pedidoDB) => {
  
        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            pedido: pedidoDB
        });

  });
  
})
  
//Path para la actualizacion de los pedidos
app.put('/api/pedido/:idUsuario', function (req, res) {
  
    let id = req.params.idUsuario;
  
    res.json({
          id
      });
    })
  
//Path para la eliminacion de pedidos
app.delete('/api/pedido', function (req, res) {
    //TO DO
})
  
module.exports = app;