//IMPORTS
//importa o express
const app = require("express")();
//Importa o CORS
const cors = require('cors');
//Importa o body parser, para que a aplicação retorne json
const bodyParser = require("body-parser");
//Importa as rotas
const routes = require("./src").routes;

//CONFIGS
//Cria o servidor
//Define o retorno do servidor para json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//Habilita o cross-origin
app.use(cors({ origin: true }));


//Define o uso das rotas
app.use("/",routes);


module.exports = app;