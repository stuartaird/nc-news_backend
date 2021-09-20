const express = require("express");
const { apiController } = require("../controllers/api.controllers.js");

const apiRouter = express.Router();

apiRouter.get("/api", apiController);

module.exports = apiRouter;
