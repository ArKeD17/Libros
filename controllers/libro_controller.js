'use strict'

/*importamos libreiras*/
const express = require('express');
const Libro = require('../models/libros_model');
const Materia = require('../models/materia_model');
const Tema = require('../models/tema_model');

/*Creamos el router*/
const router = express.Router();

router.route('/libros/libros')
    .get(Libro.index);

router.route('/libros/libros/:id')
    .delete(Libro.eliminar);

router.route('/libros/libro_nuevo')
    .get((req, res) => {
        Tema.Tema.find((err, tema) => { 
            if(err) return console.log(`Error en la peticion de tema: ${err}`);
            if(tema == null) return res.redirect(301, '/libros/libros');
            Materia.Materia.find({}).populate("tema").exec((err, materia) => {
                if(err) return console.log(`Error en la peticion de materia: ${err}`);
                if(materia == null) return res.redirect(301, '/libros/libros');
                res.render('libros/libro_nuevo', {"user": req.session.user, "tema": tema, "materia": materia});
            });  
        });
    })
    .post(Libro.create);

router.route('/libros/edit/:id')
        .put(Libro.editar)
        .get(Libro.mostrar);

/*exportamos el router*/
module.exports = router;
