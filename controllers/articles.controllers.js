const { fetchArticle } = require("../models/articles.models.js");

exports.getArticle = async (request, response, next) => {
  const article = await fetchArticle(request.params.article_id);
  response.status(200).send({ article });
};
