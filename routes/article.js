'use strict'

let express = require('express');
let ArticleController = require('../controllers/article');
let router = express.Router();

let multipart = require('connect-multiparty');
let md_upload = multipart({ uploadDir: './upload/articles' });

//rutas de prueba

router.get('/probando', ArticleController.probando);
router.get('/testController', ArticleController.test);

//rutas para artículos

router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);


module.exports = router;