const app = require('../src/app');
const knex = require('knex');
const BLOGFUL_ARTICLES = `blogful_articles`;

describe.only(`Articles Endpoints`, ()=>{
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

    context(`Given there are articles in the database`, ()=>{
        const testArticles = [
            {
                id: 1,
                date_published: '2029-01-22T16:28:32.615Z',
                title: 'First test post!',
                style: 'How-to',
                content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            },
            {
                id: 2,
                date_published: '2029-01-22T16:28:32.615Z',
                title: 'Second test post!',
                style: 'News',
                content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            },
            {
                id: 3,
                date_published: '2029-01-22T16:28:32.615Z',
                title: 'Third test post!',
                style: 'Listicle',
                content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            },
            {
                id: 4,
                date_published: '2029-01-22T21:18:32.615Z',
                title: 'Fourth Test post',
                style: 'Story',
                content: 'Lorem ipsum',
            }
        ]

        beforeEach(`Populate the test data to the test database`, ()=>{
            return db
                .into(BLOGFUL_ARTICLES)
                .insert(testArticles);
        });

        afterEach(`clean the table`, ()=>{
            return db(BLOGFUL_ARTICLES).truncate();
        });

        it(`Get /articles responds with 200 and all of the articles`, ()=>{
            return request(app)
                .get('/articles')
                .expect(200, testArticles);
        });

        it(`Get /articles/:article_id responds with 200 and the specified article`, ()=>{
            const articleId = 2;
            const expectedArticle = testArticles[articleId-1];
            return request(app)
                .get(`/articles/${articleId}`)
                .expect(200, expectedArticle)
        })
    })
});