const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    
    .then(({ rows }) => {
      if(rows.length === 0){
        return Promise.reject({status : 404, message: "Article not found"})
      }
      const article = rows[0];

      return article;
    });
};

module.exports = { selectTopics, selectArticleById };
