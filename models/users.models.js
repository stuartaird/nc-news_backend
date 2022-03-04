const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const userQueryString = `
    SELECT 
      ARRAY_AGG(username) as usernames
    FROM 
      USERS;`;

  const results = await db.query(userQueryString);

  return results.rows[0].usernames;
};
