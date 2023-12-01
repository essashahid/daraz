import mongoose from "mongoose";
import CustomerModel from "./models/customer.js";
import FeedbackModel from "./models/feedback.js";
import ManagerModel from "./models/manager.js";
import OrderModel from "./models/order.js";
import OrderDetailsModel from "./models/orderdetails.js";
import ProductModel from "./models/product.js";
import SupplierModel from "./models/supplier.js";

export async function init_db() {

  try {
    const customer = new CustomerModel({
      name: "Adeen Ali Khan",
      email: "adeen2002@gmail.com",
      password: "12345678",
    });

    const manager = new ManagerModel({
      name: "manager",
      email: "az@hotmail.com",
      password: "1234",
    });

    const supplier = new SupplierModel({
      name: "chad",
      email: "chad@abc.com",
      password: "1234",
    });

    await customer.save();
    await manager.save();
    await supplier.save();

    const order = new OrderModel({
      date:"212",
      amount:12123,
      cid:customer._id,
      sid:supplier._id,
      mid:manager._id,
    });

    await order.save();

    const product = new ProductModel({
      name: "cricket bat",
      rating: 4.50,
      price: 12000,
    })

    await product.save();

    const orderdetails = new OrderDetailsModel({
      pid: product._id,
      oid: order._id,
    })

    await orderdetails.save();


    const feedback = new FeedbackModel({
      oid: order._id,
      supplier_rating: 4.6,
      service_rating: 4.9,
    });


    await feedback.save();

  } catch (error) {
    console.error("Error saving documents:", error);
  }
}