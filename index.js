'use strict'

/*IMportamos las librerias*/
const config = require("./config");
const express = require("express");
const formidable = require("express-formidable");
const methodOverride = require("method-override");
const cookieSession = require("cookie-session");
const jade = require("jade");
const Tema = require("./models/tema_model");
/*Creamos las contantes*/
const app = express();

/*Configuramos el servidor*/
app.set("view engine",'jade');
app.use(express.static('public'));
app.use(formidable());
app.use(methodOverride('_method'));
app.use(cookieSession({ name: "session", keys: [config.SECRET]}));

/*Controladores*/

app.use(require('./controllers/user_controller.js'),require('./controllers/tema_controller.js'),require('./controllers/materia_controller.js'),require('./controllers/libro_controller.js'));

/*Corremos el servidor*/
app.listen(config.PORT, () => {
    console.log(`WEB corriendo en: http//localhost:${config.PORT}`);
});
