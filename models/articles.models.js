const db = require("../db/connection.js");

exports.fetchArticle = async (article_id) => {
  const pattern = /\D/gi; // test for non-numeric characters
  if (pattern.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const queryString = `
    SELECT  
        u.username, 
        a.title,
        a.article_id,
        a.body,
        a.topic,
        a.created_at,
        a.votes,
        COUNT(c.*) AS totalcomments
    FROM    
        articles AS a 
            JOIN users AS u ON a.author = u.user_id
            LEFT JOIN comments AS c ON a.article_id = c.article_id
    WHERE   
        a.article_id = $1
    GROUP BY 
        u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes;`;

    const articleDetails = await db.query(queryString, [article_id]);
    return articleDetails.rows[0];
  }
};

exports.updateVotes = async (article_id, inc_votes) => {
  const articlePattern = /\D/gi; // test for non-numeric characters
  const votesPattern = /^-*\d+/; // allow for negative vote adjustments
  const str_votes = inc_votes.toString();

  if (articlePattern.test(article_id) || !votesPattern.test(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const queryString = `        
    UPDATE articles
        SET votes = CASE WHEN (votes + $2 > 0) 
                        THEN votes + $2
                        ELSE 0
                    END
    WHERE   
        article_id = $1
    RETURNING 
        *;`;

    const updatedArticle = await db.query(queryString, [article_id, inc_votes]);
    return updatedArticle.rows[0];
  }
};

exports.fetchArticles = async () => {
  // TODO: REFACTOR WITH fetchArticle (if !article_id change qStr)
  const queryString = `
    SELECT  
        u.username, 
        a.title,
        a.article_id,
        a.body,
        a.topic,
        a.created_at,
        a.votes,
        COUNT(c.*) AS totalcomments
    FROM    
        articles AS a 
            JOIN users AS u ON a.author = u.user_id
            LEFT JOIN comments AS c ON a.article_id = c.article_id
    GROUP BY 
        u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes;`;

  const articles = await db.query(queryString);
  return articles.rows;
};
