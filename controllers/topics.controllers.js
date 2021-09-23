const { fetchTopics } = require("../models/topics.models.js");

exports.getTopics = async (request, response, next) => {
  try {
    const topics = await fetchTopics();
    response.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
};
