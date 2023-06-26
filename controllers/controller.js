const selectTopics = require("../models/models")


const getTopics = (req, res) => {
  selectTopics()
  .then((topics) =>
  {
    res.status(200).send({ topics })
  })
}

module.exports = getTopics