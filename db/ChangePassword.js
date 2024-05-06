import sql from "mssql";
import config from "../config.js";

const ChangePassword = async (email, password) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT * FROM dbo.users WHERE email='${email}' AND password='${password}'`
      );
    // console.log(result.recordset.length >= 1);
    if (result.recordset.length >= 1) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error executing query", err);
  }
};

export default ChangePassword;
