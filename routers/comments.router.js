const express = require("express");
const { getComments, addComment } = require("../controllers/comments.controllers.js");

const commentsRouter = express.Router({ mergeParams: true });
commentsRouter.get("/", getComments);
commentsRouter.post("/", addComment);

module.exports = commentsRouter;
