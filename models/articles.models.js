const db = require("../db/connection.js");

exports.fetchArticle = async (article_id) => {
  const queryString = `
        SELECT  u.username, 
                a.title,
                a.article_id,
                a.body,
                a.topic,
                a.created_at,
                a.votes,
                COUNT(c.*) AS totalcomments
        FROM    articles AS a 
                    JOIN users AS u ON a.author = u.user_id
                    JOIN comments AS c ON a.article_id = c.article_id
        WHERE   a.article_id = $1
        GROUP BY u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes;`;

  const articleDetails = await db.query(queryString, [article_id]);
  return articleDetails.rows[0];
};
