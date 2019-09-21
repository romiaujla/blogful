require('dotenv').config();
const {NODE_ENV} = require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require ('cors');
const helmet = require('helmet');
const articlesRouter = require('./article-router/articleRouter');

const app = express();
const morganOptions = NODE_ENV === 'production' 
    ? 'tiny' 
    : 'common';
app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());

app.get(`/`, (_,res)=>{
    res.send(`Hello World`);
});

app.use(`/articles`, articlesRouter);

module.exports = app;