const express = require("express");
const { getComments } = require("../controllers/comments.controllers.js");

const commentsRouter = express.Router({ mergeParams: true });
commentsRouter.get("/", getComments);

module.exports = commentsRouter;
