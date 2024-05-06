import sql from "mssql";
import config from "../config.js";

const AddProducts = async (name, price, brand, category, user_id, imageUrl) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    // console.log(user_id);
    request.input("name", sql.NVarChar, name);
    request.input("price", sql.Float, price);
    request.input("brand", sql.NVarChar, brand);
    request.input("category", sql.NVarChar, category);
    request.input("user_id", sql.NVarChar, user_id);
    request.input("image", sql.NVarChar, imageUrl);

    const insertingData = await request.query(`
      INSERT INTO dbo.products (name, price, brand, category, user_id, image) 
      VALUES (@name, @price, @brand, @category, @user_id,@image)
    `);
    console.log("Data is saved");
    if (insertingData) {
      // Fetch the inserted user data
      const insertedUserData = {
        name: name,
        price: price,
        brand: brand,
        category: category,
        user_id: user_id,
        image: imageUrl,
      };

      //   // Sending the inserted user data back to the client
      return insertedUserData;
    }
  } catch (err) {
    console.log("ERROR: Data is not saved");
    console.error("Error executing query", err);
  }
};

export default AddProducts;
