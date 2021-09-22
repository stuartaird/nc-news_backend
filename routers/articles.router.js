const express = require("express");
const { getArticle } = require("../controllers/articles.controllers.js");

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticle);

module.exports = articlesRouter;
