const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const userQueryString = `
    SELECT 
      *
    FROM 
      USERS;`;

  const users = await db.query(userQueryString);
  return users.rows;
};
