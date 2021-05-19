'use strict'

let validator = require('validator');
let Article = require('../models/article');
let fs  = require('fs');
let path = require('path');

let controller = {

    probando: (req, res) => {
        return res.status(200).send({
            nombre: "El Diego",
            apellido: "Reyes",
            apodo: "Shoegazer",
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Aquí está la acción test'
        });
    },
    save: (req, res) =>{
        //Obtener los parámetros
        let params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_title && validate_content){
            
            //Crear el objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }
        
            // Guardar el articulo
            article.save((err, articleStored) => {

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos !!!'
            });
        }
    },
    getArticles:(req, res) => {

        let query = Article.find({});

        let last = req.params.last

        if(last || undefined){
            query.limit(3);
        }

        //Encontrar los artículos

        query.sort('-_id').exec((err, articles) => {
            
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Algo salió mal'
                });
            } 
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay ningún artículo'
                });
            } 
            else{
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            }
        })


    },
    getArticle:(req, res) => {

        //Recoger el id de la url

        let articleId = req.params.id;

        //Comprobar que existe

        if(!articleId || articleId === null){
            return res.status(404).send({
                status: 'error',
                message: 'El artículo no existe'
            });
        }
        
        //Buscar el artículo

        Article.findById(articleId, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'El artículo no se encontró'
                });
            }
            //Devolver el artículo
            else{
                return res.status(200).send({
                    status: 'success',
                    article
                });
            }
        })
    },
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            }); 
        }

        if(validate_title && validate_content){
             // Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no existe'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
             // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },
    delete: (req, res) => {

        //Recoger el id del artículo

        let articleId = req.params.id;

        //Encontrar y borrar

        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró el artículo para borrar'
                });
            }
            else{
                return res.status(200).send({
                    status: 'success',
                    article: articleRemoved,
                    message:"Se borró el archivo correctamente"
                });
            }
        })
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        // let file_name = 'Imagen no subida...';

        // if(!req.files){
        //     return res.status(404).send({
        //         status: 'error',
        //         message: file_name
        //     });
        // }

        // Conseguir nombre y la extensión del archivo
        let file_path = req.files.file0.path;
        //var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        let file_split = file_path.split('/');

        // Nombre del archivo
        let file_name = file_split[2];

        // Extensión del fichero
        let extension_split = file_name.split('\.');
        let file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'svg' && file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
            let articleId = req.params.id;

            if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }
            
        }   
    },
    getImage: (req, res) => {
        let file = req.params.image;
        let path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        let searchString = req.params.search;

        // Find or
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }
            
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    }

};


module.exports = controller;