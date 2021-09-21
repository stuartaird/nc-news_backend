const express = require("express");
const apiRouter = require("./routers/api-router");
// const { customError, handleServerError} = require("./errors/errors.js")

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// app.use(customError);
// app.use(handleServerError);

module.exports = app;
