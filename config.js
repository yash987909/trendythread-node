import dotenv from "dotenv";
dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  trustServerCertificate: true,
  authentication: {
    type: process.env.DB_AUTH_TYPE,
    options: {
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  },
};

export default config;
