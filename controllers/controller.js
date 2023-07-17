const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  insertComment,
  selectCommentByArticleId,
  updateArticleVotes,
  deleteCommentById, selectUsers
} = require("../models/models");

const endpoints = require("../endpoints.json");

const getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const getApi = (req, res) => {
  res.status(200).send(endpoints);
};

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllArticles = (req, res) => {
  selectAllArticles()
    .then((articles) => {
      if (!articles) {
        return res.status(404).send({ message: "No articles found" });
      }
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
const getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertComment(article_id, username, body)
    .then(({ comment }) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
     ;
      next(err);
    });
};

const patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body
 
  
  updateArticleVotes(article_id, inc_votes)
  .then(( articles ) => {

    res.status(200).send({articles});

    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
  .then(() => {
    
    res.status(204).send();
  })
  .catch((err) => {
    next(err);
  });
  
}

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  })
  .catch((err) => {
    next(err);
  });
};

const getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};


module.exports = {
  getTopics,
  getApi,
  getArticlesById,
  getAllArticles,
  postComment,
  getCommentByArticleId,
  patchArticle,
  deleteComment,
  getUsers,
  getArticles
};
