const express = require("express");
const apiRouter = require("./routers/api.router.js");
const { customError, handleServerError } = require("./errors/errors.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(customError);
app.use(handleServerError);

module.exports = app;
