const express = require("express")
const {getTopics, getApi, getArticlesById} = require("./controllers/controller.js")


const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/", getApi)

app.get("/api/articles/:article_id", getArticlesById)

app.use((err, req, res, next) => {
  if(err){
   console.log(err)
  }
   next(err)
})

module.exports =  app 