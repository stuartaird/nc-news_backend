const { fetchComments } = require("../models/comments.models.js");

exports.getComments = async (request, response, next) => {
  try {
    const comments = await fetchComments(request.params.article_id);
    response.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};
