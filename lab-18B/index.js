const express = require('express')
const http = require('http');
const morgan = require("morgan")
const favicon = require("serve-favicon");

const hostname = 'localhost';

/* CRear la app Express */
// instanciar Express
const app = express();
app.set('port', process.env.PORT || 4000);
app.set('env','development'); // test stage preview production

app.use(morgan('combined'))


// Middleware
app.use( favicon( __dirname + "/public/favicon.ico") );
app.use( morgan("combined") );
app.use( express.static( __dirname + "/public"));

// Instanciar el server
const server = http.createServer(app);
server.listen( app.get('port'), hostname, () => {
    console.log(`Servidor Front End iniciado en puerto ... ${app.get('port')}`);

})

