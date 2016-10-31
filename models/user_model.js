'use strict'

/*importamos las librerias*/
const conn = require('./connection');
const Schema = conn.Schema;
const formidable = require('express-formidable');
const fs = require('fs');

/*creamos la "TABLA"*/
const user_schema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"]    
    },
    username: {
        type: String,
        required: [true, "El username es requerido"]   
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es requerido"]    
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"]    
    },
    image: {
        type: String,
        default: 'no-img.png'    
    }
});

/*Creamos modelo y funcion session*/
const User = conn.model('User', user_schema);
const path_image = './public/imgs/users/';

function parseSession(dominio, user){
    let u = JSON.parse(JSON.stringify(user));
    let d = `http://${dominio}/${path_image.replace('./public/', '')}`;
    delete u.password;
    u.image = {"origin": `${d}o_${u.image}`, "thum": `${d}t_${u.image}`};
    return u;   
}

module.exports.login = (req, res) => {
    console.log(`POST ${req.route.path}`);
    
    if(req.fields.email.length <= 0)
        return res.render('index', {"error": "El email es requerido"});
    if(req.fields.password.length <= 0)
        return res.render('index', {"error": "La contraseña es requerida"});

    User.findOne({ email: req.fields.email }, (err, user) => {
        if(err) return console.log(`Error findOne email: ${err}`);
        if(user == null) return res.render('index',{"error": `Ese email no esta registrado '${req.fields.email}'.`});
    
        if(user.password === conn.crypt(req.fields.password)){
            req.session.user = parseSession(req.headers.host, user);
            res.redirect("/perfil");
        }else
            res.render('index',{"error": "El correo o la contraseña son incorrectos."});
    }); 
}
module.exports.register = (req, res) => {
    console.log(`POST ${req.route.path}`);

    //Creamos el objeto
    let user = new User({
        name: req.fields.name,
        username: req.fields.username,
        email: req.fields.email,
        password: conn.crypt(req.fields.password),
        image: conn.subir_imagen(path_image, req.files.image)
    });

    user.save().then((data) => {
        req.session.user = parseSession(req.headers.host, user);
        if(data.image != 'no-img.png')
            conn.subir_imagen(path_image, req.files.image, data.image);
        res.redirect('/perfil');
    }, (err) => {
            res.render('registro',{"error": conn.error(err)});
        });
}

module.exports.perfil = (req, res) =>{
    console.log(`PUT ${req.route.path}`);
        
    let u = req.session.user;
    if(u == undefined)
        return res.redirect(301,'/') ;

    User.findById(u._id, (err, user) => {
        if(err) return console.log(`Error en findById id user: ${err}`);
        if(user == null) return res.redirect(301,'/');

        user.name = req.fields.name;
        user.username = req.fields.username;
        u.name = req.fields.name;
        u.username = req.fields.username;
        if(req.fields.password.length > 0)
            user.password = conn.crypt(res.fields.password);
        
        if(req.files.image != undefined)
            if(req.files.image.size > 0){
                console.log("si entra aqui a req.files")
                let name_image = conn.subir_imagen(path_image, req.files.image);
                console.log(name_image);
                let image = conn.subir_imagen(path_image, req.files.image, name_image);
                let d = `http://${req.headers.host}/${path_image.replace('./public/', '')}`;
                
                //Eliminamos imagen
                if(user.image != 'no-img.png'){
                    fs.access(path_image+"o_"+user.image, (err) => {
                        if(err){
                            if(err.code == "EEXIST"){
                                fs.unlink(`${path_image}o_${user.image}`);
                                fs.unlink(`${path_image}t_${user.image}`);
                            }
                        }
                    });
                }
                
                user.image = image;
                u.image = {"origin": `${d}o_${name_image}`, "thum": `${d}t_${name_image}`};  
            }

        User.findOne({ email: req.fields.email }, (err, e) => {
            let error = "";
            if(err) return console.log(`Error en findOne update perfil email: ${err}`);
            if(e == null){
                user.email = req.fields.email
                u.email = req.fields.email   
            }else if(req.fields.email != user.email)
                error = "El email ya esta registrado";
            
            req.session.user = u;
    
            user.save().then((data) => { 
                console.log(data);
                res.render('perfil',{"user": req.session.user, "error": error, "msg": "Se actualizaron tus datos correctamente"});
            }, (err) => {
                    console.log(err)
                    res.render('perfil',{"error": conn.error(err), "user": req.session.user});
                });
        });
    });      
}
