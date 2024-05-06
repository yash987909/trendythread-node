import sql from "mssql";
import config from "../config.js";
import fs from "fs";

const UpdateProfile = async (imageUrl, user_id, oldProfile) => {
  const isImagePathExists = fs.existsSync(
    `G:/TrendyThread Dashboard/TrendyThreadNodeJS/uploads/${oldProfile}`
  );
  const imagePath = `G:/TrendyThread Dashboard/TrendyThreadNodeJS/uploads/${oldProfile}`;
  if (isImagePathExists) {
    fs.unlink(imagePath, (err) => {
      if (err) {
        // Handle specific error if any
        if (err.code === "ENOENT") {
          console.error("File does not exist.");
        } else {
          console.error("Error deleting file:", err);
        }
      } else {
        console.log("File deleted!");
      }
    });
  }
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("image", sql.NVarChar(sql.MAX), imageUrl);
    request.input("user_id", sql.NVarChar, user_id);

    const checkProfile =
      await request.query(`SELECT profile_image FROM dbo.users 
    WHERE NOT ISNULL(profile_image, '') = '' AND user_id=@user_id`);

    console.log("PROFILE IMAGE: " + checkProfile);

    const result = await request.query(`
      UPDATE dbo.users SET profile_image=@image WHERE user_id=@user_id
    `);
    console.log("RESULT: " + result);
    if (result.rowsAffected[0] > 0) {
      return { image: imageUrl };
    } else {
      throw new Error("No rows were affected. Update failed.");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err; // Throw the error for handling elsewhere
  }
};

export default UpdateProfile;
