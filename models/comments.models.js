const db = require("../db/connection.js");

exports.fetchComments = async (article_id) => {
  const pattern = /\D/gi; // test for non-numeric characters
  if (pattern.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const queryString = `
        SELECT 
            comment_id, 
            votes, 
            created_at, 
            u.username, 
            body
        FROM
            comments 
                JOIN users AS u on comments.author = u.user_id
        WHERE
            article_id = $1;`;
    const comments = await db.query(queryString, [article_id]);
    return comments.rows;
  }
};
