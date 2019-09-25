const ARTICLESTABLE = 'blogful_articles';

const ArticlesService = {
    getAllArticles(db){
        return db
            .select('*')
            .from(ARTICLESTABLE);
    },
    insertArticle(db, newArticle){
        return db
            .insert(newArticle)
            .into(ARTICLESTABLE)
            .returning('*')
            .then((rows)=>{
                return rows[0];
            });
    },
    getById(db, id){
        return db
            .select('*')
            .from(ARTICLESTABLE)
            .where('id', id)
            .first();
    },
    deleteArticle(db, id){
        return db(ARTICLESTABLE)
            .where({id})
            .delete();
    },
    updateArticle(db, id, newArticleFields){
        return db(ARTICLESTABLE)
            .where({ id })
            .update(newArticleFields);
    }
}

module.exports = ArticlesService;