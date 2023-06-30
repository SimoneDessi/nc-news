exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({message: "Bad request"})
  }else if (err.code === '23502' ){
    res.status(400).send({message: "Comment not valid"})
  }
  else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.message) {
    res.status(err.status).send({ message: err.message})
  }
  else next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({message: "Internal Server Error"})
}