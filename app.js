const express = require("express");
const {
  getTopics,
  getApi,
  getArticlesById,
  getAllArticles, getCommentByArticleId
, postComment} = require("./controllers/controller.js");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors.js");

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/", getApi);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.post("/api/articles/:article_id/comments", postComment)


app.all("*", (req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;
