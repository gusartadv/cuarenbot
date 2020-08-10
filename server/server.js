require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser') 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/pedido'));

//Configuracion de conexion con la base de datos
mongoose.connect('mongodb://localhost:27017/bot', 
    {   useNewUrlParser: true,
        useUnifiedTopology: true
    },
    
    ( err, res )=> {

        if ( err ) throw err;

        console.log('Conectado con la base de datos');

    }
);
    
//Configuracion de escucha del puerto
app.listen(process.env.PORT, () => {
    console.log("Escucahno puerto: ", process.env.PORT);
})