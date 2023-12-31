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
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      const article = rows[0];

      return article;
    });
};
const selectArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};
const selectCommentByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else {
        return db
          .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
            [article_id]
          )
          .then(({ rows }) => {
            const comments = rows;
            if (comments.length === 0) {
              return comments;
            } else {
              return comments;
            }
          });
      }
    });
};

const insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      return { comment };
    });
};

const updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;", [
      inc_votes,
      article_id,
    ])
    .then(({ rows }) => {
     
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      const updatedArticle = rows[0];
     
      return updatedArticle;
    });
};

const deleteCommentById = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Comment not found" });
    }

    return rows;
  })
};

const selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
// const selectArticles = (topic, sort_by = "created_at", order = "desc") => {
 

//   if (!sort_by) {
//     return Promise.reject({ status: 400, message: "Invalid sort_by column" });
//   }

//   if (order !== "asc" && order !== "desc") {
//     return Promise.reject({ status: 400, message: "Invalid order value" });
//   }

//   const query = `
//     SELECT *
//     FROM articles
//     ${topic ? "WHERE topic = $1" : ""}
//     ORDER BY ${sort_by} ${order}
//   `;

//   const params = topic ? [topic] : [];

//   return db.query(query, params).then(({ rows }) => {
//     return rows;
//   });
// }; 



module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  insertComment,
  selectCommentByArticleId,
  updateArticleVotes,
  deleteCommentById,
  selectUsers,
};
