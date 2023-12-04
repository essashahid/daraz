import jwt from "jsonwebtoken";
import config from "../config/index.js";

// need to get seperate middleware for admin
// right now just checks if user is logged in
export default function middleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.customerId = decoded.customerId;
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      // Handle the specific case of an expired token
      res.status(401).json({ status: "error", message: "Your session has expired, please log in again." });
    } else {
      // Handle other kinds of errors
      res.status(401).json({ status: "error", message: "Unauthorized" });
    }
  }
}

