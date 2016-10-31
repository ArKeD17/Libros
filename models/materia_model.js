'use strict'

/*importamos las librerias*/
const conn = require('./connection');
const Schema = conn.Schema;
const formidable = require('express-formidable');
const Tema = require('./tema_model').Tema;
/*Creamos la "TABLA"*/
const materia_schema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"]
    },
    tema: {
        type: Schema.ObjectId,
        ref: 'Tema',
        required: [true, "El tema es requerido"]
    }        
});

/*creamos el modelo*/
const Materia = conn.model("Materia", materia_schema);

module.exports.Materia = Materia;

module.exports.create = (req, res) => {
    console.log(`POST ${req.route.path}`);

    let error = "";
    //creamos el objeto
    let materia = new Materia({
        name: req.fields.name,
        tema: req.fields.tema
    });
    
    materia.save().then((data) => {
        res.redirect('/materias/materia_nueva');    
    }, (err) => {
            res.render('materias/materia_nueva',{"error": conn.error(err), "user": req.session.user});
        });
}

module.exports.index = (req,res) => {
    console.log(`GET ${req.route.path}`);
    if(req.session.user != undefined){
        Materia.find({}).populate("tema").exec((err, materia) =>{
            if(err) console.log(`Error en la peticion index: ${err}`);
            res.render('materias/materias', {"materia": materia, "user": req.session.user});
        });
    }
    else
        res.redirect('/')
}


module.exports.eliminar = (req, res) => {
    console.log(`DELETE ${req.route.path}`);
    let error= "";
    Materia.findById(req.params.id, (err, materia) => {
        if(err) return console.log(`Error en el findById materia: ${err}`);
        if(materia == null) return res.redirect(301, 'materias');

        materia.remove();
        res.redirect('/materias/materias');
    });
}


module.exports.editar = (req, res) => {
    console.log(`PUT ${req.route.path}`);
    let error = "";
    
    Materia.findById(req.params.id, (err, materia) => {
        if(err) return console.log(`Error en findById id materia: ${err}`) ;
        if(materia == null) return res.redirect(301,'/materias/edit');
        Tema.Tema.find((err, tema) => {
            if(err) return console.log(`Error en find tema: ${err}`);
            if(tema == null) return res.redirect(301,'/materias/edit');
            
            materia.name = req.fields.name
            materia.tema = req.fields.tema

            materia.save().then((data) => {
                res.render('materias/edit',{"error": error, "msg": "Se actualizo correctamente", "user": req.session.user, "materia": materia, "tema": tema});
            }, (err) => {
                    res.render('/materias/edit', {"error": conn.error(err)});
                });
        });
    });
    
}

module.exports.mostrar = (req, res) => {
    console.log(`GET ${req.route.path}`) ;
    if(req.session.user != undefined){
        Materia.findById(req.params.id, (err, materia) => {
            if(err) return console.log(`Error findById materia: ${err}`);
            if(materia == null) return res.redirect(301,"/materias/edit");
            Tema.Tema.find((err, tema) => {
                if(err) return console.log(`Error en find tema: ${err}`);
                if(tema == null) return res.redirect(301,"/materias/edit");
                res.render("materias/edit", { "user": req.session.user, "tema": tema, "materia": materia});
            });
        });
    }else
        res.redirect('/');   
}









