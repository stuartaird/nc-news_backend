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

exports.insertComment = async (article_id, comment) => {
  const pattern = /\D/gi; // test for non-numeric characters

  if (!comment.username || !comment.body || pattern.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const userSearch = await db.query(
      `
    SELECT user_id FROM users WHERE username = $1;`,
      [comment.username]
    );

    if (userSearch.rowCount === 0) {
      return Promise.reject({ status: 400, msg: "Bad User Id" });
    } else {
      const user_id = userSearch.rows[0].user_id;

      const insertQueryString = `
        INSERT INTO comments
            (author, article_id, body)
        VALUES
            ($1, $2, $3)
        RETURNING 
            comment_id;`;
      const newComment_Id = await db.query(insertQueryString, [
        user_id,
        article_id,
        comment.body,
      ]);

      const commentQueryString = `
        SELECT
            comment_id, 
            u.username, 
            article_id, 
            votes, 
            created_at,
            body
        FROM
            comments 
            JOIN users AS u ON comments.author = u.user_id
        WHERE
            comment_id = $1;
      `;
      const newComment = await db.query(commentQueryString, [
        newComment_Id.rows[0].comment_id,
      ]);

      return newComment.rows;
    }
  }
};
