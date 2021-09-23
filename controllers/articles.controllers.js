const {
  fetchArticle,
  updateVotes,
  fetchArticles,
} = require("../models/articles.models.js");

exports.getArticle = async (request, response, next) => {
  try {
    const article = await fetchArticle(request.params.article_id);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.changeVotes = async (request, response, next) => {
  try {
    const article = await updateVotes(request.params.article_id, request.body.inc_votes);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.getArticles = async (request, response, next) => {
  try {
    fetchArticles();
  } catch (error) {
    next(error);
  }
};
