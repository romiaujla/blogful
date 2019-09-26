require('dotenv').config();
const express = require('express');
const articleRouter = express.Router();
const bodyParser = express.json();
const ArticlesService = require('./articles-service');



articleRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db');
        ArticlesService.getAllArticles(db)
            .then((articles) => {
                res.json(articles);
            })
            .catch(next);
    });

articleRouter
    .route('/:article_id')
    .get((req, res, next)=>{
        const db = req.app.get('db');
        const { article_id } = req.params;
        ArticlesService.getById(db, article_id)
            .then((article) => {
                req.json(article);
            })
            .catch(next);
    })

module.exports = articleRouter;