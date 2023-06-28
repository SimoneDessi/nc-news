exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({message: "Bad request"})
  }
  else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.message) {
    res.status(err.status).send({ message: err.message})
  }
}

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({message: "Internal Server Error"})
}