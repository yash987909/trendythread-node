import sql from "mssql";
import config from "../config.js";

const UpdateProduct = async (
  product_id,
  name,
  price,
  brand,
  category,
  user_id
) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("product_id", sql.Int, product_id);
    request.input("name", sql.NVarChar, name);
    request.input("price", sql.Float, price);
    request.input("brand", sql.NVarChar, brand);
    request.input("category", sql.NVarChar, category);
    request.input("user_id", sql.NVarChar, user_id);

    const insertingData = await request.query(`
    UPDATE dbo.products SET name=@name, price=@price, brand=@brand, category=@category WHERE product_id =@product_id ;
    `);
    // console.log("Data is saved");
    if (insertingData) {
      // Fetch the inserted user data
      const insertedUserData = {
        name: name,
        price: price,
        brand: brand,
        category: category,
        user_id: user_id,
      };

      //   // Sending the inserted user data back to the client
      return insertedUserData;
    }
  } catch (err) {
    console.log("ERROR: Data is not saved");
    console.error("Error executing query", err);
  }
};

export default UpdateProduct;
