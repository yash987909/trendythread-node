import express, { urlencoded } from "express";
import sql from "mssql";
import cors from "cors";
import config from "./config.js";
import UserRegister from "./db/UserRegister.js";
import UserSignIn from "./db/UserSignIn.js";
import AddProducts from "./db/AddProducts.js";
import GetProducts from "./db/GetProducts.js";
import DeleteProducts from "./db/DeleteProducts.js";
import bodyParser from "body-parser";
import UpdateProduct from "./db/UpdateProduct.js";
import UpdateProductList from "./db/UpdateProductList.js";
import Jwt from "jsonwebtoken";
import verifyToken from "./middleware/verifyToken.js";
import GetUser from "./db/GetUser.js";
import ChangePassword from "./db/ChangePassword.js";
import UpdatePassword from "./db/UpdatePassword.js";
import multer from "multer";
import UpdateProfile from "./db/UpdateProfile.js";

const app = express();
const port = 3000;
const jwtKey = "TrendyThread";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.fieldname + ".png");
  },
});

const upload = multer({ storage: storage });

sql
  .connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server");
    // You can execute queries here
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server", err);
  });

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Password validation criteria
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
  const isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    return res.status(400).json({ error: "Password does not meet criteria" });
  }

  try {
    const insertedUserData = await UserRegister(
      firstName,
      lastName,
      email,
      password
    );
    if (insertedUserData) {
      Jwt.sign(
        { insertedUserData },
        jwtKey,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) {
            res.status(500).send("Error signing up user token not found");
          }
          res.status(201).json({ insertedUserData, auth: token });
        }
      );
    }
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).send("Error signing up user");
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await UserSignIn(email, password);
    delete result.password;
    if (result) {
      Jwt.sign({ result }, jwtKey, { expiresIn: "24h" }, (err, token) => {
        if (err) {
          res.status(500).send("Error");
        }
        res.status(201).json({ result, auth: token });
      });
    } else {
      res.send("Please Enter both fields");
    }
  } catch {
    res.status(500).send("Error");
  }
});

app.post("/delete", verifyToken, async (req, res) => {
  const { product_id } = req.body;
  try {
    const result = await DeleteProducts(product_id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.send("Invalid Product ID");
    }
  } catch {
    res.status(500).send("Error");
  }
});

app.post(
  "/addproducts",
  upload.single("image"),
  verifyToken,
  async (req, res) => {
    const { name, price, brand, category, user_id } = req.body;
    console.log("PRODUCTS::: " + req.file.path);
    const imageUrl = req.file.path.slice(8);

    try {
      const insertedUserData = await AddProducts(
        name,
        price,
        brand,
        category,
        user_id,
        imageUrl
      );

      // Sending the inserted user data back to the client
      res.status(201).json(insertedUserData);
    } catch (err) {
      console.error("Error signing up user:", err);
      res.status(500).send("Error signing up user");
    }
  }
);

app.post("/updateproductdetails", verifyToken, async (req, res) => {
  const { product_id, name, price, brand, category, user_id } = req.body;

  if (!name) {
    res.send("Please Provide Name");
  } else if (!price) {
    res.send("Please Provide Price");
  } else if (!brand) {
    res.send("Please Provide brand");
  } else if (!category) {
    res.send("Please Provide category");
  }

  try {
    const insertedUserData = await UpdateProduct(
      product_id,
      name,
      price,
      brand,
      category,
      user_id
    );

    // Sending the inserted user data back to the client
    res.status(201).json(insertedUserData);
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).send("Error signing up user");
  }
});

app.post("/updateproduct/:id", verifyToken, async (req, res) => {
  try {
    const getProduct = await UpdateProductList(req.params.id);
    res.status(201).json(getProduct);
  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).send("Failed to Get Products");
  }
});

app.post("/", verifyToken, async (req, res) => {
  try {
    const getProduct = await GetProducts();
    res.status(201).json(getProduct);
  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).send("Failed to Get Products");
  }
});

app.post("/profile/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const getUser = await GetUser(id);
    res.status(201).json(getUser[0]);
  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).send("Failed to Get User");
  }
});

app.post("/changepassword", verifyToken, async (req, res) => {
  const { email, password } = req.body;
  const result = await ChangePassword(email, password);
  res.status(201).json(result);
});

app.post("/updatepassword", verifyToken, async (req, res) => {
  const { user_id, password } = req.body;
  const result = await UpdatePassword(user_id, password);
  res.status(201).json(result);
});

app.post(
  "/addprofile",
  upload.single("profile_image"),
  verifyToken,
  async (req, res) => {
    const { user_id, oldProfile } = req.body;
    // console.log("PROFILE FILE:" + req.file.path);
    console.log("PROFILE FILE:" + oldProfile);
    const imageUrl = req.file.path.slice(8);
    try {
      const result = await UpdateProfile(imageUrl, user_id, oldProfile);
      console.log("Result: ", result.image);
      res.status(201).json(result);
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(401).send("Not Updated");
    }
  }
);

app.listen(port, () => {
  console.log("Server is started");
});
