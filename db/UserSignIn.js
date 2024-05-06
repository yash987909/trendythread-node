import sql from "mssql";
import config from "../config.js";

const UserSignIn = async (email, password) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dbo.users WHERE email='${email}' AND password='${password}'`
      );
    console.log("login");
    if (result) {
      // Sending the inserted user data back to the client
      return result.recordset[0];
    }
  } catch (err) {
    console.log("ERROR: Data is not saved");
    console.error("Error executing query", err);
    res.status(500).send("Error saving data");
  }
};

export default UserSignIn;
