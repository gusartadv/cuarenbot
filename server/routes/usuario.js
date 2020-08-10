const express = require('express')
const app = express()
const Usuario = require('../models/usuario');

//path para obtener los pedidos por idUsuario
app.get('/api/usuario/:docuento', function (req, res) {

    let id = req.params.documento;
    
    Usuario.findOne({ documento: id })
        .exec( (err, usuario) => {

            if ( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario
            });

        } )

})
   
//path para la creacion de pedidos
app.post('/api/usuario', function (req, res) {
  
  let body = req.body;

  let usuario = new Usuario({
    nombre : body.nombre,
    apellido : body.apellido,
    usuario : body.usuario,
    clave : body.clave,
    rol : body.rol,
  });

  usuario.save((err, usuarioDB) => {
  
        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
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