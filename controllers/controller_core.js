const selectTopics = require("../models/models_core")


const getTopics = (req, res) => {
  selectTopics()
  .then((topics) =>
  {
    res.status(200).send({ topics })
  }).catch((err) => {
    console.log(err)
  })
}

module.exports = getTopics