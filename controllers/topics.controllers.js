const { fetchTopics } = require("../models/topics.models.js");

exports.getTopics = async (request, response, next) => {
  await fetchTopics();
  response.status(200).send({ msg: "test" });
};
