import sql from "mssql";
import config from "../config.js";

const GetProfileImage = async (user_id) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    // console.log(user_id);
    request.input("user_id", sql.NVarChar, user_id);

    const result = await request.query(`
      SELECT profile_image FROM dbo.users WHERE user_id=@user_id
    `);

    if (result) {
      return result;
    }
  } catch (err) {
    console.log("ERROR: Not Able to get profile image");
    console.error("Error executing query", err);
  }
};

export default GetProfileImage;
