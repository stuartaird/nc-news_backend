exports.customError = (error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

exports.handleServerError = (error, request, response, next) => {
  if (error) {
    console.log(error);
    response.status(500).send({ msg: "Internal Server Error" });
  }
};
