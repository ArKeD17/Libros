'use strict'
    
/*Importamos las librerias*/
const conn = require('./connection');
const Schema = conn.Schema;
const formidable = require('express-formidable');
const User = require('./user_model');
/*Creamos la "TABLA"*/
const tema_schema = new Schema({
    name: {
        type: String, 
        required: [true, "El nombre es requerido"]
    },
    date_create: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/*creamos el modelo*/
const Tema = conn.model('Tema', tema_schema);

module.exports.Tema = Tema;

module.exports.create = (req, res) => {
    console.log(`POST ${req.route.path}`);
   
    let error= ""; 
    //creamos el objeto
    let tema = new Tema({
        name: req.fields.name,
        creator: req.session.user._id
    });    

    tema.save().then((data) => {
        res.redirect('/temas/tema_nuevo');
    }, (err) => {
            res.render('temas/tema_nuevo', {"error": conn.error(err), "user": req.session.user});
        });
}


module.exports.tema = (req, res) =>{
    console.log(`PUT ${req.route.path}`);
    let error= "";
    Tema.findById(req.params.id, (err, tema) => {
        if(err) return console.log(`Error en el findById id tema: ${err}`);
        if(tema == null) return res.redirect(301, '/temas/edit');
        tema.name = req.fields.name

        tema.save().then((data) => {
            res.render('temas/edit', {"error": error, "msg": "Se actualizo correctamente", "user": req.session.user, "tema": tema});
        }, (err) => {
                res.render('temas/edit', {"error": conn.error(err)});
            });
    });
}


module.exports.eliminar = (req, res) => {
    console.log(`DELETE ${req.route.path}`);
    let error= "";
        Tema.findById(req.params.id, (err, tema) => {
            if(err) return console.log(`Error en en el finById id tema: ${err}`);
            if(tema == null) return res.redirect(301, 'temas');

            tema.remove();
            res.redirect('/temas/temas');
        });   
}

module.exports.mostrar = (req,res) => {
    console.log(`GET ${req.route.path}`);
    if(req.session.user != undefined){
        Tema.findById(req.params.id,(err, tema) => {
            if(err) return console.log(`Error findById id tema: ${err}`);
            if(tema == null) return res.redirect(301,'/');     
            res.render("temas/edit",{"user": req.session.user, "tema": tema});
        });
    }else
        res.redirect('/')
}


module.exports.index = (req,res) => {
    console.log(`GET ${req.route.path}`);
        if(req.session.user != undefined){
            Tema.find({creator: req.session.user}).populate("creator").exec((err, tema) => {
                if(err) console.log(`Error en la peticion index: ${err}`);
                    res.render('temas/temas',{"tema": tema, "user": req.session.user});
            });
        }
        else
            res.redirect('/')
   
}


