const app = require('../src/app');
const knex = require('knex');
const BLOGFUL_ARTICLES = `blogful_articles`;
const { makeEndpointArticlesArray } = require('./aticles.fixtures');

describe(`Articles Endpoints`, ()=>{
    let db;

    before(`Making knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
        app.set('db', db);
    });

    after(`disconnect from db`, ()=>{
        return db.destroy();
    })

    before(`clean the table`, ()=>{
        return db(BLOGFUL_ARTICLES).truncate();
    });

    afterEach(`clean the table`, ()=>{
        return db(BLOGFUL_ARTICLES).truncate();
    });

    describe(`GET /articles`, ()=>{
        context(`Given there are articles in the database`, ()=>{
            const testArticles = makeEndpointArticlesArray();
    
            beforeEach(`Populate the test data to the test database`, ()=>{
                return db
                    .into(BLOGFUL_ARTICLES)
                    .insert(testArticles);
            });
    
            
    
            it(`Get /articles responds with 200 and all of the articles`, ()=>{
                return request(app)
                    .get('/articles')
                    .expect(200, testArticles);
            });
        });

        context(`Given there are no articles`, ()=>{
            it(`Get /articles resolves and empty list and responds with 200`, ()=>{
                return request(app)
                    .get('/articles')
                    .expect(200, []);
            })
        });
    });
    

    describe(`GET /articles/:articles_id`, ()=>{
        context(`Given there are articles in the database`, ()=>{
            const testArticles = makeEndpointArticlesArray();
    
            beforeEach(`Populate the test data to the test database`, ()=>{
                return db
                    .into(BLOGFUL_ARTICLES)
                    .insert(testArticles);
            });
       
            it(`Get /articles/:article_id responds with 200 and the specified article`, ()=>{
                const articleId = 2;
                const expectedArticle = testArticles[articleId-1];
                return request(app)
                    .get(`/articles/${articleId}`)
                    .expect(200, expectedArticle)
            });
        });

        context(`Given there are no articles`, ()=>{
            it(`Get /articles/:articles_id responds with 404 not found`, ()=>{
                const article_id = 123456
                return request(app)
                    .get(`/articles/${article_id}`)
                    .expect(404, { error: { message: `Article doesn't exist` }})
            })
        })
    });
});