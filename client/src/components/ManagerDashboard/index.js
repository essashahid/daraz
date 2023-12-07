import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TextInput, Grid } from '@mantine/core';
import axios from 'axios';
import api from '../../api';

const ManagerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const managerId = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  const [showTooltip, setShowTooltip] = useState(false);


  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/product/list`);
      setProducts(response.data.data); // Since the response contains an array in the 'data' key
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  


  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${api}/order/all`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${api}/user/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const deleteProduct = async (productId) => {
    const url = `${api}/product/${productId}`;
    console.log("Delete URL:", url); // Log the URL to verify it
  
    try {
      await axios.delete(url);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const updateManagerDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${api}/user/update/${managerId}`,
        { name: managerName, email: managerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Manager details updated successfully");
        localStorage.setItem("userName", managerName);
        localStorage.setItem("userEmail", managerEmail);
      }
    } catch (error) {
      console.error("Error updating manager details:", error);
      alert("Failed to update manager details.");
    }
  };

  const viewCustomerOrders = async (customerId) => {
    try {
      const response = await axios.get(`${api}/order/customer-orders/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerOrders(response.data.data); // Assuming the response has an array of orders under 'data'
    } catch (error) {
      console.error('Error fetching orders for customer:', error);
    }
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };


  return (
    <Container>
      <h1>Manager Dashboard</h1>
      <Grid>
        {/* Section for Products
        <Grid.Col span={6}>
          <h2>Products</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {products && products.map((product) => (

                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <Button variant="light" onClick={() => alert('Edit functionality')}>Edit</Button>
                    <Button variant="red" onClick={() => deleteProduct(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        {/* </Grid.Col> */}

        {/* Section for Customer Orders */}
<Grid.Col span={12}>
  <h2>Customer Orders</h2>
  {customerOrders.length > 0 ? (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {customerOrders.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>${order.amount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <p>No orders placed yet.</p>
  )}
</Grid.Col>

        {/* Section for Customer Management */}
        <Grid.Col span={12}>
          <h2>Customers</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Button onClick={() => viewCustomerOrders(customer._id)}>View Orders</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Grid.Col>

        {/* Section for Updating Manager Details */}
        <Grid.Col span={12}>
          <h2>Update Your Details</h2>
          <form onSubmit={updateManagerDetails}>
            <TextInput
              label="Name"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="Enter your name"
              mb="md"
            />
            <TextInput
              label="Email"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
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

export default ManagerDashboard;