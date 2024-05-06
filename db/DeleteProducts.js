import sql from "mssql";
import config from "../config.js";
import fs from "fs";

const DeleteImage = async (product_id) => {
  const pool = await sql.connect(config);
  const imageUrl = await pool
    .request()
    .query(`SELECT image FROM dbo.products WHERE product_id=${product_id}`);

  console.log("Image Url: " + imageUrl);

  const imagePath = `G:/TrendyThread Dashboard/TrendyThreadNodeJS/uploads/${imageUrl?.recordset[0]?.image}`;
  console.log("Attempting to delete file at path:", imagePath);

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
};

const DeleteProducts = async (product_id) => {
  try {
    await DeleteImage(product_id);
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`DELETE FROM dbo.products WHERE product_id=${product_id}`);
    console.log("Deleted");
    if (result) {
      // Sending the inserted user data back to the client
      return result;
    }
  } catch (err) {
    console.log("ERROR: Data is not saved");
    console.error("Error executing query", err);
    res.status(500).send("Error saving data");
  }
};

export default DeleteProducts;
