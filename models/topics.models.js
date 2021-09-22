const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const results = await db.query("SELECT * FROM TOPICS;");
  return results.rows;
};
