const express = require("express");
const {
  getArticle,
  changeVotes,
  getArticles,
} = require("../controllers/articles.controllers.js");
const commentsRouter = require("../routers/comments.router.js");

const articlesRouter = express.Router();
articlesRouter.use("/:article_id/comments", commentsRouter);

articlesRouter.get("", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", changeVotes);

module.exports = articlesRouter;
