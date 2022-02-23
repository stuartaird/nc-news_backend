const express = require("express");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/comments.controllers.js");

const commentsRouter = express.Router({ mergeParams: true });
commentsRouter.get("/", getComments);
commentsRouter.post("/", addComment);
commentsRouter.delete("/:comment_id", deleteComment);
module.exports = commentsRouter;
