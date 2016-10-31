'use strict'

/*importamos librerias*/
const config = require('../config');
const mongoose = require('mongoose');
const easyimage = require('easyimage');
const fs = require('fs')

/*Variable de conexion a DB*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/libros', (err, res) => {
    if(err) console.log(`Error al conectar con mongodb: ${err}`);
    else console.log('La conexion a mongodb ha sido correcta');  
});

/*Exportamos el modelo*/
module.exports = mongoose;

/*Por si Hay errores*/
module.exports.error = (err) =>{
    let error = "";
    if(err.errors != undefined)
        for(var key in err.errors)
            error += err.errors[key].message;
    else if(err.errmsg != undefined)
        error = `${err.errmsg.split(":")[2].split("_")[0].replace(" "," ")} Ya existe una cuenta`;
    else
        error = "Ocurrio un error en el sistema";
    return error;
}

/* Funcion para incriptar cadenas*/
module.exports.crypt = (string) => {
    const crypto = require('crypto');
    return crypto.createHmac('md5', config.SECRET).update(string).digest('hex');
}

/*funcion para subir imagenes*/
module.exports.subir_imagen = (path_image, imagen, nombre=false, size=300) =>{
    if(imagen != undefined){
        var extencion = imagen.name.split('.').pop();
        if(!nombre){
            nombre = Date.now() + "." + extencion;
            return nombre;
        } 
        fs.rename(imagen.path, path_image + 'o_' + nombre);
        easyimage.info(path_image+"o_"+nombre).then(
            (file) => {
               easyimage.resize({
                    src: path_image + "o_" +nombre,
                    dst: path_image + "t_" + nombre,
                    width: size,
                    height: (size*file.height)/file.width     
               }); 
            }, (err) => {
                    console.log(`Miniatura fallida ${err}`);
                });  
            return nombre;
    }
    return imagen;
}

