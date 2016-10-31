'use strict'

/*importamos librerias*/
const express = require('express');
const User = require('../models/user_model');

/*Creamos el router*/
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('index');    
    })
    .post(User.login);

router.get('/salir', (req, res) => {
    delete req.session.user;
    res.redirect('/');        
});

router.route('/registro')
    .get((req, res) => {
        res.render('registro');    
    })
    .post(User.register);

router.route('/perfil')
    .get((req, res) => {
        if(req.session.user != undefined)
            res.render('perfil', {user: req.session.user});
        else
            res.redirect('/');    
    })
    .put(User.perfil);

/*Exportamos el router*/
module.exports = router;
