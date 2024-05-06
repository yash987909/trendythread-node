import sql from "mssql";
import config from "../config.js";

import crypto from "crypto";

const UserRegister = async (firstName, lastName, email, password) => {
  try {
    const user_id = crypto.randomBytes(16).toString("hex");
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("user_id", sql.NVarChar, user_id);
    request.input("firstname", sql.NVarChar, firstName);
    request.input("lastname", sql.NVarChar, lastName);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, password);

    const insertingData = await request.query(
      `INSERT INTO dbo.users (user_id, firstname, lastname, email, password) VALUES (@user_id, @firstname, @lastname, @email, @password)`
    );

    // console.log(checkemail);
    // console.log("Data is saved");
    if (insertingData) {
      // Fetch the inserted user data
      const insertedUserData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };

      // Sending the inserted user data back to the client
      return insertedUserData;
    }
  } catch (err) {
    console.log("ERROR: Data is not saved");
    console.error("Error executing query", err);
  }
};

export default UserRegister;
