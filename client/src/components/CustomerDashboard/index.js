import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import api from "../../api";

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const customerID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    if (!!customerID) {
      try {
        const response = await axios.get(`${api}/product/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const products = response.data.data;

        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  }, [customerID, token]);

  const fetchOrders = useCallback(async () => {
    if (!!customerID) {
      try {
        const response = await axios.get(
          `${api}/order/customer-orders/${customerID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    }
  }, [customerID, token]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchOrders, fetchProducts]);

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const amount = cart.reduce((acc, item) => acc + item.price, 0);
      const productIDs = cart.map((item) => item._id);

      const response = await axios.post(
        `${api}/order/place`,
        {
          customerID: customerID,
          products: productIDs,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed:", response);
      alert("Order placed successfully!");
      setCart([]);
      fetchOrders();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order.");
    }
  };

  return (
    <Container>
      <h1>Customer Dashboard</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map((product) => (
          <Col key={product._id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Rating: {product.rating}</Card.Text>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Button variant="primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {cart.length > 0 && (
        <div>
          {cart.map((item) => (
            <Card key={item._id} className="cart-item mb-2">
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Button
                  variant="danger"
                  className="remove-from-cart-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove from Cart
                </Button>
              </Card.Body>
            </Card>
          ))}

          <Button
            className="place-order-btn mt-3"
            variant="success"
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </div>
      )}

      {orders.length > 0 && (
        <div>
          <h2>Your Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className="order">
              <p>Order ID: {order._id}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Total Amount: ${order.amount}</p>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default CustomerDashboard;
