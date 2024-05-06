import Jwt from "jsonwebtoken";

const jwtKey = "TrendyThread";

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(403).send("Please Provide Valid Token");
      } else {
        next();
      }
    });
  } else {
    res.status(401).send("Please Provide Token");
  }
};

export default verifyToken;
