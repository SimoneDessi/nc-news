const { selectTopics, selectArticleById, selectAllArticles} = require("../models/models");
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
  const body = req.body;
  return insertComment(body).then(({ rows }) => {


      res.status(201)
      .send({ comment : rows[0] });
  
  })
  .catch(err => {
      console.log(err)
  });
}

module.exports = { getTopics, getApi, getArticlesById, getAllArticles, postComment };
