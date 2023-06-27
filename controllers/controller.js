const { selectTopics, selectArticleById } = require("../models/models");
const endpoints = require("../endpoints.json");

const getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
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
      console.log(err);
      next(err)
    });
};

module.exports = { getTopics, getApi, getArticlesById };
