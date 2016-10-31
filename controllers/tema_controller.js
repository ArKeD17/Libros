'use estrict'
    
/*Importamos librerias*/
const express = require('express');
const Tema = require('../models/tema_model');

/*Creamos el router*/
const router = express.Router();

router.route('/temas/temas')
    .get(Tema.index);
    //.delete(Tema.eliminar)

router.route('/temas/tema_nuevo')
    .get((req, res) => {
        if(req.session.user != undefined)
            res.render('temas/tema_nuevo', {user: req.session.user});
        else
            res.redirect('/');
    })
    .post(Tema.create);

router.route('/temas/temas/:id')
    .delete(Tema.eliminar);

router.route('/temas/edit/:id')
    .get(Tema.mostrar)
    .put(Tema.tema); 
    
 

/*exxportamos el router*/
module.exports = router;
