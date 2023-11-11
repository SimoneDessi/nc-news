const {
  selectTopics,
  selectArticleById,
  selectArticles,
  insertComment,
  selectCommentByArticleId,
  updateArticleVotes,
  deleteCommentById, selectUsers
} = require("../models/models");

const endpoints = require("../endpoints.json");

const getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  })
  .catch(next);
};

const getApi = (req, res, ) => {
  res.status(200).send(endpoints);
}


const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ message: "No articles found" });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};
const getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertComment(article_id, username, body)
    .then(({ comment }) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body
 
  
  updateArticleVotes(article_id, inc_votes)
  .then(( articles ) => {

    res.status(200).send({articles});

    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
  .then(() => {
    
    res.status(204).send();
  })
  .catch(next);
  
}

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  })
  .catch(next);
};

// const getArticles = (req, res, next) => {
//   const { topic, sort_by, order } = req.query;

//   selectArticles(topic, sort_by, order)
//     .then((articles) => {
//       res.status(200).send({ articles });
//     })
//     .catch(next);
// };


module.exports = {
  getTopics,
  getApi,
  getArticlesById,
  getArticles,
  postComment,
  getCommentByArticleId,
  patchArticle,
  deleteComment,
  getUsers,
 
};
