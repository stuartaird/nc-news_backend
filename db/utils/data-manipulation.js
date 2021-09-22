const db = require("../connection.js");
const cloneDeep = require("lodash.clonedeep");

exports.getAuthorList = () => {
  return db.query(`SELECT user_id, username FROM USERS;`).then((results) => results.rows);
};

exports.usernameToUserId = async (authorsData) => {
  const updatedAuthors = cloneDeep(authorsData);

  const userList = await db.query(`SELECT user_id, username FROM USERS;`);
  let results = userList.rows;

  updatedAuthors.forEach((entry) => {
    let user = results.find((usr) => usr.username === entry.author);
    entry.author = user.user_id;
  });

  return updatedAuthors;
};
