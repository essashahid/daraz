import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

import { Form } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import api from "../../api";

import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Drawer,
  Grid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { CartContext } from "../../contexts/cart";

function CartDrawer({ cart, opened, close, removeFromCart, placeOrder }) {
  return (
    <Drawer opened={opened} onClose={close} title="Cart">
      {cart.length === 0 ? (
        <Center>
          <Text>Cart is empty</Text>
        </Center>
      ) : (
        <>
          {cart.length > 0 && (
            <div>
              {cart.map((item) => (
                <Card key={item._id}>
                  <Card.Section>
                    <Title>{item.name}</Title>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove from Cart
                    </Button>
                  </Card.Section>
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
        </>
      )}
    </Drawer>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section inheritPadding>
        <Title order={3}>{product.name}</Title>
      </Card.Section>
      <Divider />
      <Text>Rating: {product.rating}</Text>
      <Text>Price: ${product.price}</Text>
      <Text>{product.inStock ? "In Stock" : "Out of Stock"}</Text>
      <Button
        variant="primary"
        onClick={() => addToCart(product)}
        disabled={!product.inStock}
      >
        Add to Cart
      </Button>
    </Card>
  );
}

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useContext(CartContext);

  const [orders, setOrders] = useState([]);
  const customerID = localStorage.getItem("userID");
  const [feedbacks, setFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem("feedbacks");
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : {};
  });

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

  const [opened, { open, close }] = useDisclosure(false);

  const addToCart = (product) => {
    open();

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
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order.");
    }
  };

  const handleFeedbackChange = (orderId, productId, field, value) => {
    setFeedbacks({
      ...feedbacks,
      [orderId]: {
        ...feedbacks[orderId],
        [productId]: {
          ...feedbacks[orderId]?.[productId],
          [field]: value,
          submitted: feedbacks[orderId]?.[productId]?.submitted || false,
        },
      },
    });
  };

  // Adjusted function to submit feedback for a product
  const submitFeedback = async (orderId, productId) => {
    const currentFeedback = feedbacks[orderId]?.[productId];
    if (!currentFeedback) {
      alert("Please provide feedback before submitting.");
      return;
    }

    if (currentFeedback.submitted) {
      alert("Feedback for this product has already been submitted.");
      return;
    }

    try {
      await axios.post(
        `${api}/feedback/submit`,
        {
          oid: orderId,
          pid: productId,
          supplier_rating: currentFeedback.supplier_rating,
          service_rating: currentFeedback.service_rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the feedbacks state with the submitted feedback
      const updatedFeedbacks = {
        ...feedbacks,
        [orderId]: {
          ...feedbacks[orderId],
          [productId]: {
            ...currentFeedback,
            submitted: true, // Set the submitted flag to true
          },
        },
      };

      setFeedbacks(updatedFeedbacks);

      // Save the updated feedbacks to localStorage
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <Box p={20}>
      <h1>Customer Dashboard</h1>

      <CartDrawer
        cart={cart}
        opened={opened}
        close={close}
        removeFromCart={removeFromCart}
        placeOrder={placeOrder}
      />

      <TextInput
        mb={20}
        type="text"
        placeholder="Search Products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Grid>
        {products
          .filter((product) =>
            product.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase().trim())
          )
          .map((product) => (
            <Grid.Col key={product._id} span={2}>
              <ProductCard product={product} addToCart={addToCart} />
            </Grid.Col>
          ))}
      </Grid>

      {orders.length > 0 && (
        <div>
          <h2>Your Orders</h2>
          {orders.map((order) =>
            order.products && order.products.length > 0 ? (
              <Card key={order._id}>
                <Card.Section>
                  {order.products.map((product) => (
                    <div key={product._id}>
                      <h5>{product.name}</h5>
                      <Form>
                        {/* Supplier Rating */}
                        <Form.Group>
                          <Form.Label>Supplier Rating</Form.Label>
                          <StarRatings
                            rating={
                              feedbacks[order._id]?.[product._id]
                                ?.supplier_rating || 0
                            }
                            starRatedColor="blue"
                            changeRating={(newRating) =>
                              handleFeedbackChange(
                                order._id,
                                product._id,
                                "supplier_rating",
                                newRating
                              )
                            }
                            numberOfStars={5}
                            name="supplier_rating"
                          />
                        </Form.Group>

                        {/* Service Rating */}
                        <Form.Group>
                          <Form.Label>Service Rating</Form.Label>
                          <StarRatings
                            rating={
                              feedbacks[order._id]?.[product._id]
                                ?.service_rating || 0
                            }
                            starRatedColor="blue"
                            changeRating={(newRating) =>
                              handleFeedbackChange(
                                order._id,
                                product._id,
                                "service_rating",
                                newRating
                              )
                            }
                            numberOfStars={5}
                            name="service_rating"
                          />
                        </Form.Group>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            variant="primary"
                            onClick={() =>
                              submitFeedback(order._id, product._id)
                            }
                            disabled={
                              feedbacks[order._id]?.[product._id]?.submitted
                            }
                          >
                            Submit Feedback
                          </Button>
                          {feedbacks[order._id]?.[product._id]?.submitted && (
                            <span
                              style={{ marginLeft: "10px", color: "green" }}
                            >
                              Feedback Submitted
                            </span>
                          )}
                        </div>
                      </Form>
                    </div>
                  ))}
                </Card.Section>
              </Card>
            ) : null
          )}
        </div>
      )}
    </Box>
  );
};

export default CustomerDashboard;
