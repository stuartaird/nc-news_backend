const express = require("express");
const usersRouter = express.Router();
const { getUsers } = require("../models/users.models.js");

usersRouter.get("", getUsers);

module.exports = usersRouter;
