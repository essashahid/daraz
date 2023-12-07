import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import api from "../../api";

import { Box, Button, Card, Flex, Grid, Stack, TextInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchOrdersKey,
  submitFeedback,
  submitFeedbackKey,
} from "../../api/orders";
import { fetchProducts, fetchProductsKey } from "../../api/products";
import { CartContext } from "../../contexts/cart";
import FeedbackRating from "../core/Rating";
import ProductCard from "../dashboard/ProductCard";

const CustomerDashboard = () => {
  const token = localStorage.getItem("token");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data: productsData, isSuccess } = useQuery({
    queryKey: [fetchProductsKey],
    queryFn: fetchProducts,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess) {
      setFilteredProducts(productsData || []);
    }
  }, [isSuccess, productsData]);
  // ------------------------------------------

  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts(productsData || []);
    } else if (!!searchQuery) {
      setFilteredProducts(
        productsData.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        )
      );
    }
  }, [searchQuery, productsData]);
  // ------------

  const { addToCart } = useContext(CartContext);
  const { data: ordersData, isSuccess: isOrdersSuccess } = useQuery({
    queryKey: [fetchOrdersKey],
    queryFn: fetchOrders,
    staleTime: Infinity,
  });

  // -----------

  const customerID = localStorage.getItem("userID");
  const [customerName, setCustomerName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const updateCustomerDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${api}/user/update/${customerID}`,
        { name: customerName, email: customerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Update state and local storage
        setCustomerName(response.data.data.name); // Assuming response contains updated name
        setCustomerEmail(response.data.data.email); // Assuming response contains updated email
        localStorage.setItem("userName", response.data.data.name);
        localStorage.setItem("userEmail", response.data.data.email);
        alert("Customer details updated successfully");
      }
    } catch (error) {
      console.error("Error updating customer details:", error);
      alert("Failed to update customer details.");
    }
  };

  const showOrders = ordersData?.length > 0 && isOrdersSuccess;

  const [orderFeedbacks, setOrderFeedbacks] = useState([]);

  useEffect(() => {
    // console.log("orderFeedbacks", orderFeedbacks);
  }, [orderFeedbacks]);
  const feedbackMutation = useMutation({
    mutationKey: [submitFeedbackKey],
    mutationFn: submitFeedback,
  });

  async function onFeedbackSubmit(orderID, productID) {
    const key = `${orderID}-${productID}`;
    const feedbackRating = orderFeedbacks[key];
    await feedbackMutation.mutateAsync({ orderID, productID, feedbackRating });
  }

  useEffect(() => {
    const initialFeedbacks = {};
    ordersData?.forEach((order) => {
      order.products?.forEach((item) => {
        initialFeedbacks[`${order._id}-${item.product._id}`] =
          item?.rating ?? 0;
      });
    });
    setOrderFeedbacks(initialFeedbacks);
  }, [ordersData]);

  const handleFeedbackChange = (itemId, rating) => {
    setOrderFeedbacks((prev) => ({ ...prev, [itemId]: rating }));
  };

  return (
    <Box p={20}>
      <h1>Customer Dashboard</h1>

      <form onSubmit={updateCustomerDetails}>
        <Stack gap={10}>
          <TextInput
            label="Name"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <TextInput
            label="Email"
            placeholder="Your Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
          <Button type="submit">Update Details</Button>
        </Stack>
      </form>

      <TextInput
        my={"lg"}
        type="text"
        placeholder="Search Products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Grid>
        {filteredProducts?.map((product) => (
          <Grid.Col key={product._id} span={2}>
            <ProductCard product={product} addToCart={addToCart} />
          </Grid.Col>
        ))}
      </Grid>
      {showOrders && (
        <div>
          <h2>Your Orders</h2>
          {ordersData?.map((order, index) => {
            return (
              <Card key={index} withBorder p={"lg"} m={"lg"}>
                <Flex wrap="wrap" m={"lg"}>
                  {order.products.map((orderItem, subIndex) => {
                    return (
                      <Card key={subIndex} withBorder p={"lg"} m={"lg"}>
                        <h3>{orderItem.product.name}</h3>
                        <p>Quantity: {orderItem.quantity}</p>
                        <FeedbackRating
                          loading={feedbackMutation.isPending}
                          value={
                            orderFeedbacks[
                              `${order._id}-${orderItem.product._id}`
                            ]
                          }
                          onChange={(rating) =>
                            handleFeedbackChange(
                              `${order._id}-${orderItem.product._id}`,
                              rating
                            )
                          }
                        />

                        <Button
                          loading={feedbackMutation.isPending}
                          onClick={() =>
                            onFeedbackSubmit(order._id, orderItem.product._id)
                          }
                          mt={10}
                        >
                          Rate Product
                        </Button>
                      </Card>
                    );
                  })}
                </Flex>
              </Card>
            );
          })}
        </div>
      )}
    </Box>
  );
};

export default CustomerDashboard;
