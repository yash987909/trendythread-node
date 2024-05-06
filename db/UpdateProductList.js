import sql from "mssql";
import config from "../config.js";

const UpdateProductList = async (id) => {
  try {
    // console.log(id);
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT * FROM dbo.products WHERE product_id=${id}`);
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

export default UpdateProductList;
