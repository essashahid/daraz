import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import customerRouter from './routes/customerRouter.js';
import supplierRouter from './routes/supplierRouter.js';
import managerRouter from './routes/managerRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import orderdetailsRouter from './routes/orderdetailsRouter.js';


import { init_db } from "./mongo_init.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

const router = express.Router();

mongoose.connect(process.env.MONG_URI)
.then(()=>{
    app.listen(process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`)
    console.log("Connected to Database")
})})
.catch((error)=>{
    console.log(error)
})

// init_db();

//Make your API calls for every usecase here
app.use("/", router);

router.use("/customer", customerRouter);
router.use("/supplier", supplierRouter);
router.use("/manager", managerRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/orderdetails", orderdetailsRouter);



