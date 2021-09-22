const db = require("../connection.js");
const format = require("pg-format");
const { usernameToUserId } = require("../utils/data-manipulation.js");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;

  /******************************************************************/
  /*                        DROP TABLES                             */
  /******************************************************************/

  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  /******************************************************************/
  /*                        CREATE TABLES                           */
  /******************************************************************/
  await db.query(`
    CREATE TABLE users (
      user_id         SERIAL PRIMARY KEY,
      username        VARCHAR(20) UNIQUE NOT NULL, 
      avatar_URL      VARCHAR(150),
      name            VARCHAR(80) NOT NULL
    );`);

  await db.query(`
    CREATE TABLE topics (
      topic_id        SERIAL PRIMARY KEY,
      slug            VARCHAR(50) NOT NULL,
      description     VARCHAR(100)
    );`);

  await db.query(`
    CREATE TABLE articles (
      article_id      SERIAL PRIMARY KEY,
      title           VARCHAR(100) NOT NULL,
      body            TEXT,
      votes           INT DEFAULT 0, 
      topic           VARCHAR(50),
      author          INT REFERENCES users(user_id),
      created_at      TIMESTAMP DEFAULT NOW()
    );`);

  await db.query(`
    CREATE TABLE comments (
      comment_id      SERIAL PRIMARY KEY,
      author          INT REFERENCES users(user_id),
      article_id      INT REFERENCES articles(article_id),
      votes           INT DEFAULT 0,
      created_at      TIMESTAMP DEFAULT NOW(),
      body            TEXT
    );`);

  /******************************************************************/
  /*                        SEED TABLES                             */
  /******************************************************************/
  // USERS
  const formattedUsers = userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });

  const userQuery = format(
    `INSERT INTO users (username, avatar_url, name)
    VALUES %L
    RETURNING *;`,
    formattedUsers
  );
  await db.query(userQuery);

  // TOPICS
  const formattedTopics = topicData.map((topic) => {
    return [topic.slug, topic.description];
  });

  const topicsQuery = format(
    `INSERT INTO topics (slug, description)
    VALUES %L
    RETURNING *;`,
    formattedTopics
  );
  await db.query(topicsQuery);

  // ARTICLES
  // replace author names with id's prior to seeding articles table
  const updatedArticles = await usernameToUserId(articleData);

  const formattedArticles = updatedArticles.map((article) => {
    return [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      article.created_at,
    ];
  });

  const articlesQuery = format(
    `INSERT INTO articles (title, body, votes, topic, author, created_at)
    VALUES %L
    RETURNING *;`,
    formattedArticles
  );
  await db.query(articlesQuery);

  // COMMENTS
  // replace author names with id's prior to seeding comments table
  const updatedComments = await usernameToUserId(commentData);

  const formattedComments = updatedComments.map((comment) => {
    return [
      comment.author,
      comment.article_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
  });

  const commentsQuery = format(
    `INSERT INTO comments (author, article_id, votes, created_at, body)
    VALUES %L
    RETURNING *;`,
    formattedComments
  );
  await db.query(commentsQuery);
};

/******************************************************************/

module.exports = seed;
