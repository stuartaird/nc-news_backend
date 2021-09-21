const db = require("../connection.js");

exports.getAuthorList = () => {
  return db.query(`SELECT user_id, username FROM USERS;`).then((results) => results.rows);
};

exports.usernameToUserId = async (authorsData) => {
  const updatedAuthors = [...authorsData];

  const userList = await db.query(`SELECT user_id, username FROM USERS;`);
  // .then((result) => result.rows);
  let results = userList.rows;

  updatedAuthors.forEach((entry) => {
    let user = results.find((usr) => usr.username === entry.author);
    let userid = user.user_id;
    // console.log(user.username, user.user_id);
    entry.author = userid;
  });

  return updatedAuthors;
};
///////////////////
// exports.getFormattedUsers = async (userData) => {
//   let formattedUsers = userData.map((user) => {
//     console.log(`util >> inside .map >> ${[user.username, user.avatar_url, user.name]}`);
//     user.username, user.avatar_url, user.name;
//   });
//   console.log(`util >> formattedUsers: ${formattedUsers}`);
//   return formattedUsers;
// };
//////////////////
