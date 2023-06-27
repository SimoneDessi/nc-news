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
if( isNaN(article_id) ){
  return res.status(400).send({message: "Invalid article id"})
}
  selectArticleById(article_id)
    .then((article) => {
      if(!article) {
        return res.status(404).send({message: "Article not found"})
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err)
    });
};

module.exports = { getTopics, getApi, getArticlesById };
