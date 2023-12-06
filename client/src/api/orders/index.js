import axios from "axios";
import api from "../../api";

export const fetchOrdersKey = "fetchOrders";

export async function fetchOrders() {
  const customerID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${api}/order/customer-orders/${customerID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const orders = response.data.data;
  return orders;
}

export const placeOrderKey = "placeOrder";

export async function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart"));

  const amount = cart.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  const products = cart.map((item) => {
    return {
      product: item.productID,
      quantity: item.quantity,
    };
  });

  const customerID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${api}/order/place`,
    {
      customerID: customerID,
      products: products,
      amount: amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const createdOrder = response.data.data;
  return createdOrder;
}

export const submitFeedbackKey = "submitFeedback";

export async function submitFeedback({ orderID, productID, feedbackRating }) {
  const token = localStorage.getItem("token");

  console.log("submitFeedback", orderID, productID, feedbackRating);

  const response = await axios.post(
    `${api}/order/feedback`,
    {
      orderID: orderID,
      productID: productID,
      rating: feedbackRating,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const feedback = response.data.data;
  return feedback;
}
