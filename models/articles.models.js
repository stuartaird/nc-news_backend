const db = require("../db/connection.js");

exports.fetchArticle = async (article_id) => {
  const pattern = /\D/gi; // test for non-numeric characters
  if (pattern.test(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const queryString = `
    SELECT  
        u.username AS author, 
        a.title,
        a.article_id,
        a.body,
        a.topic,
        a.created_at,
        a.votes,
        COUNT(c.*)::int AS totalcomments
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
  // const str_votes = inc_votes.toString();

  if (articlePattern.test(article_id) || !votesPattern.test(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    const updateVotesQuery = `        
    UPDATE articles
        SET votes = CASE WHEN (votes + $2 > 0) 
                        THEN votes + $2
                        ELSE 0
                    END
    WHERE   
        article_id = $1
    RETURNING 
        article_id`;

    const updated_Id = await db.query(updateVotesQuery, [article_id, inc_votes]);

    const articleQuery = `
    SELECT 
      article_id,
      title,
      body,
      votes,
      topic,
      u.username AS author,
      created_at
    FROM
      articles 
      JOIN users AS u on articles.author = u.user_id
    WHERE
      article_id = $1;
   `;

    const updatedArticle = await db.query(articleQuery, [updated_Id.rows[0].article_id]);

    return updatedArticle.rows[0];
  }
};

exports.fetchArticles = async (topic, sort_by = "article_id", order = "DESC") => {
  // reject promise if query params are invalid
  if (topic) {
    const topicsQuery = {
      rowMode: "array",
      text: "SELECT DISTINCT slug FROM topics;",
    };
    const topicsArray = await db.query(topicsQuery).then((results) => {
      return results.rows.flat();
    });

    if (!topicsArray.includes(topic)) {
      return Promise.reject({ status: 400, msg: "Invalid topic" });
    }
  }

  if (sort_by) {
    const sortQuery = {
      rowMode: "array",
      text: "SELECT column_name FROM information_schema.columns WHERE table_name = 'articles';",
    };
    const sortArray = await db.query(sortQuery).then((results) => {
      return results.rows.flat();
    });

    if (!sortArray.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sort" });
    }
  }

  if (order) {
    if (order.toUpperCase() !== "ASC" && order.toUpperCase() !== "DESC") {
      return Promise.reject({ status: 400, msg: "Invalid sort order" });
    }
  }

  // TODO: REFACTOR WITH fetchArticle (if !article_id change qStr)
  let queryString = `
    SELECT  
        u.username AS author, 
        a.title,
        a.article_id,
        a.body,
        a.topic,
        a.created_at,
        a.votes,
        COUNT(c.*)::int AS totalcomments
    FROM    
        articles AS a 
          JOIN users AS u ON a.author = u.user_id
          LEFT JOIN comments AS c ON a.article_id = c.article_id `;
  if (topic) queryString += `WHERE a.topic = '${topic}' `;
  queryString += `
    GROUP BY 
        u.username, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes
    ORDER BY 
        ${sort_by} ${order};`;

  const articles = await db.query(queryString);
  return articles.rows;
};
