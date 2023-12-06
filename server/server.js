import cors from "cors";

import express from "express";
import mongoose from "mongoose";
import config from "./config/index.js";
import orderRouter from "./routes/orderRouter.js";

import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json());

app.use(cors());

const router = express.Router();

mongoose
  .connect(config.mongoUri)
  .then(() => {
    app.listen(config.port, () => {
      console.log(`listening on port ${config.port}`);
      console.log("Connected to Database");
    });
  })
  .catch((error) => {
    console.log(error);
  });

//Make your API calls for every usecase here
app.use("/", router);
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
