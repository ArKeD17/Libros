'use strict'

/*Importamos las librerias*/
const conn = require('./connection');
const Schema = conn.Schema;
const formidable = require('express-formidable');
const fs = require('fs');
const Tema = require('./tema_model');
const Materia = require('./materia_model');
const User = require('./user_model');
/*Creamos la "TABLA"*/
const libro_schema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"]    
    },
    tema: {
        type: String,
        required: [true, "El tema es requerido"]
    },
    materia: {
        type: String,
        required: [true, "La materia es requerida"]
    },
    autor: {
        type: String,
        required: [true, "El autor es requerido"]
    },
    costo: {
        type: Number
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/*Creamos el modelo*/
const Libro = conn.model("Libro", libro_schema);

module.exports.Libro = Libro;

module.exports.create = (req, res) => {
    console.log(`POST ${req.route.path}`);
    
    let error = "";
    //creamos el objeto
    let libro = new Libro({
        name: req.fields.name,
        tema: req.fields.tema,
        materia: req.fields.materia,
        autor: req.fields.autor,
        costo: req.fields.costo,
        creator: req.session.user._id
    });    

    libro.save().then((data) => {
        res.redirect('/libros/libro_nuevo');
    }, (err) => {
            Tema.Tema.find({creator: req.session.user},(erro, tema) => {
                if(erro) return console.log(`Error en la peticion de tema: ${erro}`);
                if(tema == null) return res.redirect(301, 'libros');
                Materia.Materia.find({}).populate("tema").exec((erro, materia) => {
                    if(erro) return conole.log(`Error en la peticion de materia: ${err}`);
                    if(materia == null) return res.redirect(301,'libros');
                    res.render('libros/libro_nuevo',{"error": conn.error(err), "user": req.session.user, "tema": tema, "materia": materia});    
                });
            });
        });
}

module.exports.eliminar = (req, res) => {
    console.log(`DELETE ${req.route.path}`);

    let error= "";
        Libro.findById(req.params.id, (err, libro) => {
            if(err) return console.log(`Error en el findById de libro: ${err}`);
            if(libro == null) return res.redirect(301, 'libros');

            libro.remove();
            res.redirect('/libros/libros');
        });    
}

module.exports.index = (req, res) => {
    console.log(`GET ${req.route.path}`);

    if(req.session.user != undefined){
        Libro.find({creator: req.session.user}).populate("creator").exec((err, libro) =>{
            //console.log(libro);
            if(err) console.log(`Error en la peticion index de libros: ${err}`);
            res.render('libros/libros', {"libro": libro, "user": req.session.user});
        });
    }else
        res.redirect('/')
}

module.exports.editar = (req, res) => {
    console.log(`PUT ${req.route.path}`);
    let error = "";
    if(req.session.user != undefined){
        Libro.findById(req.params.id, (err, libro) => {
            if(err) return console.log(`Error en findById de libro: ${err}`);
            if(libro == null) return res.redirect(301, '/libros/libros');
            Tema.Tema.find((err, tema) => {
                if(err) return console.log(`Error en la peticion de tema: ${err}`);
                if(tema == null) return res.redirect(301, '/libros/libros');
                Materia.Materia.find({}).populate("tema").exec((err, materia) => {
                    if(err) return console.log(`Error en la peticion de materia: ${err}`) ;
                    if(materia == null) return res.redirect(301, '/libros/libros');
                    libro.name = req.fields.name
                    libro.autor = req.fields.autor
                    libro.costo = req.fields.costo
                    libro.tema = req.fields.tema
                    libro.materia = req.fields.materia
                
                    libro.save().then((data) => {
                        res.render('libros/edit', {"libro": libro, "user": req.session.user,"msg": "Se actualizo correctamente" ,"tema": tema, "materia": materia,"error": error});   
                    }, (err) => {
                            Libro.findById(req.params.id, (erro, libro) => {
                                if(erro) return console.log(`Error en findById de libro: ${erro}`);
                                if(libro == null) return res.redirect(301,'libros');
                                Tema.Tema.find({creator: req.session.user},(erro, tema) => {
                                    if(erro) return console.log(`Error en la peticion de tema: ${erro}`);
                                    if(tema == null) return res.redirect(301,'libros');
                                    Materia.Materia.find((erro, materia) => {
                                        if(erro) return console.log(`Error en la peticion de materia: ${erro}`);
                                        if(materia == null) return res.redirec(301,'libros');
                                        res.render('libros/edit',{"error": conn.error(err), "tema": tema, "materia": materia, "libro": libro, "user": req.session.user});
                                    });
                                });
                            });
                        });
                });
            });
        });
    }    
       
}


module.exports.mostrar = (req, res) => { 
    console.log(`GET ${req.route.path}`);
    let error= "";
    if(req.session.user != undefined){
        Libro.findById(req.params.id, (err, libro) => {
            if(err) return console.log(`Error en findById de libro: ${err}`);
            if(libro == null) return res.redirect(301,'/libros/libros');
            Tema.Tema.find({creator: req.session.user},(err, tema) => {
                if(err) return console.log(`Error en la peticion de tema: ${err}`);
                if(tema == null) return res.redirect(301, '/libros/libros');
                Materia.Materia.find({}).populate("tema").exec((err, materia) => {
                    if(err) return console.log(`Error en la peticion de materia: ${err}`);
                    if(materia == null) return res.redirect(301, '/libros/libros');
                    res.render('libros/edit', {"user": req.session.user, "tema": tema, "libro": libro,"materia": materia});
                });
            });   
        });    
    }else
        res.redirect('/');
}















