const {
  fetchComments,
  insertComment,
  removeComment,
} = require("../models/comments.models.js");

exports.getComments = async (request, response, next) => {
  try {
    const comments = await fetchComments(request.params.article_id);
    response.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (request, response, next) => {
  try {
    const comment = await insertComment(
      request.params.article_id,
      request.body
    );
    response.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (request, response, next) => {
  try {
    const removedComment = await removeComment(
      request.params.article_id,
      request.params.comment_id
    );
    response.status(202).send({ removedComment });
  } catch (error) {
    next(error);
  }
};
