const knex = require('knex');
const app = require('./app');
const {PORT, NODE_ENV, DB_URL} = require('./config');

const db = knex({
    client: 'pg',
    connection: DB_URL,
});

app.set('db', db);

app.use((error, req, res, next) => {
    let response = {};
    if(NODE_ENV === 'production'){
        response = {
            error: {
                message: `Server Error`
            }
        }
    }else{
        response = {error}
    }
    res.status(500).json(response);
});

app.listen(PORT, ()=> {
    console.log(`Sever listening at PORT:${PORT}`);
});