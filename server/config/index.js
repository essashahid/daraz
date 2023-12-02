import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONG_URI,
  jwtSecret: process.env.SECRET_KEY,
};
