import sql from "mssql";
import config from "../config.js";

const GetProducts = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        `SELECT products.*, users.firstname, users.lastname FROM dbo.products JOIN dbo.users ON products.user_ID = users.user_ID ORDER BY product_id DESC;`
      );
    // console.log("Displaying Products");
    if (result) {
      // Sending the inserted user data back to the client
      return result.recordset;
    }
  } catch (err) {
    console.log("ERROR: Not able to get Products");
    console.error("Error executing query", err);
    res.status(500).send("Not able to get Products");
  }
};

export default GetProducts;
