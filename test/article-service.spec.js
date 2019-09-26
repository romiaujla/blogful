const ArticlesServices = require('../src/articles/articles-service');
const knex = require('knex');
const ARTICLESTABLE = 'blogful_articles';
const { makeServicesArticlesArray } = require('./aticles.fixtures');

describe(`Article Services object: `, ()=>{

    let db;

    let testArticles = makeServicesArticlesArray();

    before(`Make knex instance`, ()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    after(`Disconnect from db`, ()=>{
        return db.destroy();
    });

    before(`Clean the table`, ()=>{
        return db(ARTICLESTABLE).truncate();
    });

    afterEach(()=>{
        return db(ARTICLESTABLE).truncate();
    })

    context(`Given '${ARTICLESTABLE}' has data`, ()=>{
        beforeEach(`Insert test data into '${ARTICLESTABLE}' table`, ()=>{
            return db
                .into(ARTICLESTABLE)
                .insert(testArticles);
        });

        it(`Returns all articles from '${ARTICLESTABLE}' table`, ()=> {
            return ArticlesServices.getAllArticles(db)
                .then((res) => {
                    expect(res).to.eql(testArticles);
                });
        });

        it(`getById() resolves an article by id from '${ARTICLESTABLE}' table`, ()=>{
            const searchId = 3;
            const testArticle = testArticles[searchId-1];
            return ArticlesServices.getById(db, searchId)
                .then((actual)=>{
                    // Are line 69 and 70 the samething.
                    expect(actual).to.deep.eql(testArticle);
                    expect(actual).to.eql({
                        id: searchId,
                        title: testArticle.title,
                        style: testArticle.style,
                        content: testArticle.content,
                        date_published: new Date(testArticle.date_published)
                    });
                });
        });

        it(`deleteArticle() removes an article by id from '${ARTICLESTABLE}' table`, ()=>{
            const articleId = 3;
            return ArticlesServices.deleteArticle(db, articleId)
                .then(() => ArticlesServices.getAllArticles(db))
                .then((allArticles)=>{
                    const expected = testArticles.filter((article)=> article.id !== articleId);
                    expect(allArticles).to.eql(expected);
                });
        });

        it(`updateArticle() updates an article from the '${ARTICLESTABLE}' table`, ()=>{
            const idOfArticleToUpdate = 3;
            const newArticle = {
                title: 'updated title',
                style: 'How-to',
                content: 'updated content',
                date_published: new Date()
            }
            return ArticlesServices.updateArticle(db, idOfArticleToUpdate, newArticle)
                .then(()=> ArticlesServices.getById(db, idOfArticleToUpdate))
                .then((updatedArticle) =>{
                    expect(updatedArticle).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticle
                    });
                });
        });
    });

    context(`Given '${ARTICLESTABLE}' has no data`, ()=>{
        it(`getAllArticles resolves an empty array`, ()=>{
            return ArticlesServices.getAllArticles(db)
                .then((actual)=>{
                    expect(actual).to.eql([]);
                });
        });

        it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, ()=>{
            const newArticle = {
                title: 'Test new title',
                style: 'News',
                content: 'Test new content',
                date_published: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ArticlesServices.insertArticle(db, newArticle)
                .then((actual)=>{
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        style: newArticle.style,
                        content: newArticle.content,
                        date_published: new Date(newArticle.date_published)
                    });
                });
        });

    });
    

    

    
});
