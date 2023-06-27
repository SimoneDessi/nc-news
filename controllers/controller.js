const selectTopics = require("../models/models")
const endpoints = require("../endpoints.json")

const getTopics = (req, res) => {
  selectTopics()
  .then((topics) =>
  {
    res.status(200).send({ topics })
  })
}

const getApi = (req, res) =>{
  res.status(200).send(endpoints)
}

module.exports = { getTopics, getApi }