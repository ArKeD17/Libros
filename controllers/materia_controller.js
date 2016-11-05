'use strict'

/*Importamos las libreias*/
const express = require("express");
const Materia = require('../models/materia_model');
const Tema = require("../models/tema_model"); 
/*Creamos el router*/
const router = express.Router();

router.route('/materias/materias')
    .get(Materia.index);

router.route('/materias/materia_nueva')
    .get((req, res) => {
        Tema.Tema.find({creator: req.session.user},(err, tema) => {
            if(err) console.log(`Error en la peticion de tema: ${err}`);
            res.render('materias/materia_nueva',{"user": req.session.user, "tema": tema});    
        });
    })
    .post(Materia.create);

router.route('/materias/materias/:id')
    .delete(Materia.eliminar);

router.route('/materias/edit/:id')
    .put(Materia.editar)
    .get(Materia.mostrar);

/*Exportampos el router*/
module.exports = router;
