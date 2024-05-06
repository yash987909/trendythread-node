import sql from "mssql";
import config from "../config.js";

const UpdatePassword = async (user_id, password) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(
      `UPDATE dbo.users
        SET password ='${password}'
        WHERE user_id ='${user_id}';`
    );
    if (result) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error executing query", err);
  }
};

export default UpdatePassword;
