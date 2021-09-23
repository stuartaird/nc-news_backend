const express = require("express");
const { getArticle, changeVotes } = require("../controllers/articles.controllers.js");

const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", changeVotes);

module.exports = articlesRouter;
