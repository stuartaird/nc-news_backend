const express = require("express");
const { getUsers } = require("../controllers/users.controllers.js");

const usersRouter = express.Router();

usersRouter.get("", getUsers);

module.exports = usersRouter;
