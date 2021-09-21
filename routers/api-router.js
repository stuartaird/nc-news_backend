const express = require("express");
const { getEndpoints } = require("../controllers/api.controllers.js");
const { getTopics } = require("../controllers/topics.controllers.js");

const apiRouter = express.Router();

apiRouter.get("", getEndpoints);
apiRouter.get("/topics", getTopics);

module.exports = apiRouter;
