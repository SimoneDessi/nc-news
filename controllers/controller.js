const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  insertComment
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
      res.status(400).send({ message: "Page not found!" });
    });
};

const postComment = (req, res) => {
  const {article_id} = req.params
  const {author, body} = req.body
  console.log(article_id, author, body)
  return insertComment(article_id, author, body)
    .then(({ comment }) => {

      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getTopics,
  getApi,
  getArticlesById,
  getAllArticles,
  postComment,
};
