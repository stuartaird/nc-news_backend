const express = require("express");
const topicsRouter = require("./topics.router.js");
const articlesRouter = require("./articles.router.js");
const { getEndpoints } = require("../controllers/api.controllers.js");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.get("", getEndpoints);

module.exports = apiRouter;
