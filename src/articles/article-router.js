require('dotenv').config();
const express = require('express');
const articleRouter = express.Router();
const bodyParser = express.json();
const ArticlesService = require('./articles-service');

// Creating database connection
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});

articleRouter
    .route('/')
    .get((req, res) => {
        console.log(ArticlesService.getAllArticles());
        res.send(`GET articles reached`);
    });

module.exports = articleRouter;