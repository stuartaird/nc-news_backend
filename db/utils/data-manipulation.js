const db = require("../connection.js");
const cloneDeep = require("lodash.clonedeep");

exports.getAuthorList = () => {
  return db.query(`SELECT user_id, username FROM USERS;`).then((results) => results.rows);
};

exports.usernameToUserId = async (authorsData, userList) => {
  const updatedAuthors = cloneDeep(authorsData);

  updatedAuthors.forEach((entry) => {
    let user = userList.find((usr) => usr.username === entry.author);
    entry.author = user.user_id;
  });

  return updatedAuthors;
};
