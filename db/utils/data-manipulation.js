const db = require("../connection.js");

exports.getAuthorList = () => {
  return db
    .query(`SELECT user_id, username FROM USERS;`)
    .then((results) => results.rows);
};

exports.usernameToUserId = async (authorsData) => {
  const updatedAuthors = [...authorsData];

  const userList = await db
    .query(`SELECT user_id, username FROM USERS;`)
    .then((result) => result.rows);

  updatedAuthors.forEach((entry) => {
    let user = userList.find((user) => user.username === entry.author);
    entry.author = user.user_id;
  });

  return updatedAuthors;
};
