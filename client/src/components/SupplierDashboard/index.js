import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Table, Button, TextInput, NumberInput, Tooltip, Card, Text } from '@mantine/core';
import api from '../../api';

const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const supplierId = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [customProductRating, setCustomProductRating] = useState('');
  const [customProductInStock, setCustomProductInStock] = useState('');

  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');

  const fetchProducts = useCallback(async () => {
    if (supplierId) {
      try {
        const response = await axios.get(`${api}/product/supplier-products/${supplierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching suppliers products by id:", error);
      }
    }
  }, [supplierId, token]);

  const fetchOrders = useCallback(async () => {
    if (supplierId) {
      try {
        const response = await axios.get(`${api}/order/supplier-orders/${supplierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders by suppliers id:", error);
        setOrders([]);
      }
    }
  }, [supplierId, token]);

  const fetchFeedbacks = useCallback(async () => {
    if (supplierId) {
      try {
        const response = await axios.get(`${api}/product/supplier-orders/${supplierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = response.data.data;
  
        const productRatings = new Map();
  
        orders.forEach(order => {
          order.products.forEach(({ product, rating }) => {
            // Ensure the product belongs to this supplier and the rating is available
            if (product.supplierId === supplierId && rating) {
              if (!productRatings.has(product._id)) {
                productRatings.set(product._id, {
                  name: product.name,
                  ratings: []
                });
              }
              // Assuming rating is a string, convert it to a number
              productRatings.get(product._id).ratings.push(Number(rating));
            }
          });
        });
  
        const formattedFeedbacks = Array.from(productRatings.values()).map(({ name, ratings }) => ({
          productName: name,
          averageRating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 'No ratings'
        }));
  
        setFeedbacks(formattedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setFeedbacks([]);
      }
    }
  }, [supplierId, token]);
  

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchFeedbacks();
  }, [fetchProducts, fetchOrders, fetchFeedbacks]);
  const createRandomProduct = async () => {
    try {
      const response = await axios.post(`${api}/product/create`, 
        {
          supplierId: supplierId, // Include supplierId in the request body
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include the token if needed
        }
      );
  
      if (response.status === 201) {
        alert("Product created successfully");
        fetchProducts(); // Refresh the product list
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  const createCustomProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${api}/product/create-custom`, 
        {
          supplierId: supplierId,
          name: customProductName,
          price: parseFloat(customProductPrice), // Ensure this is a number
          rating: parseFloat(customProductRating), // Ensure this is a number
          inStock: parseInt(customProductInStock), // Convert to integer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        alert("Custom product created successfully");
        fetchProducts();
        // Reset form fields
        setCustomProductName('');
        setCustomProductPrice('');
        setCustomProductRating('');
        setCustomProductInStock('');
      }
    } catch (error) {
      console.error("Error creating custom product:", error);
      alert("Failed to create custom product.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const truncateId = (id) => {
    return id.length > 10 ? `${id.substring(0, 7)}...` : id;
  };

  const updateSupplierDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${api}/user/update/${supplierId}`,
        { name: supplierName, email: supplierEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Supplier details updated successfully");
        // update local storage
        localStorage.setItem("userName", supplierName);
        localStorage.setItem("userEmail", supplierEmail);

      }
    } catch (error) {
      console.error("Error updating supplier details:", error);
      alert("Failed to update supplier details.");
    }
  };


  return (
    <Container size="lg" mt="md">
      <h1>Supplier Dashboard</h1>
      <Grid>
        {/* Section for Product Management */}
        <Grid.Col span={6}>
          <h2>Your Products</h2>
          <Button onClick={createRandomProduct} className="mb-3">
            Create Random Product
          </Button>
          <form onSubmit={createCustomProduct} style={{ marginBottom: '1rem' }}>
            <TextInput
              label="Name"
              value={customProductName}
              onChange={(e) => setCustomProductName(e.target.value)}
              placeholder="Enter product name"
              mb="md"
            />
            <NumberInput
              label="Price"
              value={customProductPrice}
              onChange={(value) => setCustomProductPrice(value)}
              placeholder="Enter price"
              mb="md"
            />
            {/* <NumberInput
              label="Rating"
              value={customProductRating}
              onChange={(value) => setCustomProductRating(value)}
              placeholder="Enter rating"
              mb="md"
            /> */}
            <NumberInput
              label="In Stock"
              value={customProductInStock}
              onChange={(value) => setCustomProductInStock(value)}
              placeholder="Enter stock availability"
              mb="md"
            />
            <Button type="submit">Create Custom Product</Button>
          </form>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <Tooltip label={product._id} position="bottom">
                      <Button variant="subtle" compact>
                        {truncateId(product._id)}
                      </Button>
                    </Tooltip>
                  </td>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col>

          <Grid.Col span={12}>
          <h2>Feedback on Your Products</h2>
          {feedbacks.length > 0 ? (
            feedbacks.map(feedback => (
              <Card key={feedback.productName}>
                <Text>Product: {feedback.productName}</Text>
                <Text>Average Rating: {feedback.averageRating}</Text>
              </Card>
            ))
          ) : (
            <Text>No feedback available</Text>
          )}
          </Grid.Col>

        {/* Section for Order Management
        <Grid.Col span={6}>
          <h2>Orders</h2>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerID}</td>
                  <td>${order.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col> */}
  
        {/* Section for Updating Supplier Details */}
        <Grid.Col span={12}>
          <h2>Update Your Details</h2>
          <form onSubmit={updateSupplierDetails}>
            <TextInput
              label="Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Enter your name"
              mb="md"
            />
            <TextInput
              label="Email"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
              placeholder="Enter your email"
              mb="md"
            />
            <Button type="submit">Update Details</Button>
          </form>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default SupplierDashboard;