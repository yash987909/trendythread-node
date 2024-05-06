import sql from "mssql";
import config from "../config.js";

const GetUser = async (id) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT firstname,lastname,email,profile_image,user_id FROM dbo.users WHERE user_id='${id}'`
      );
    // console.log("Displaying Users");
    if (result) {
      // Sending the inserted user data back to the client
      return result.recordset;
    }
  } catch (err) {
    console.log("ERROR: Not able to get User");
    console.error("Error executing query", err);
    res.status(500).send("Not able to get User");
  }
};

export default GetUser;
