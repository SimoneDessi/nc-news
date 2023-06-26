const express = require("express")
const {getTopics, getApi} = require("./controllers/controller.js")


const app = express()


app.get("/api/topics", getTopics)

app.get("/api/", getApi)

module.exports =  app 