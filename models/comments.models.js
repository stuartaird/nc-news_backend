const db = require("../db/connection.js");

exports.fetchComments = async (article_id) => {
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
            article_id = $1;
    `;
  const comments = await db.query(queryString, [article_id]);
  return comments.rows;
};
