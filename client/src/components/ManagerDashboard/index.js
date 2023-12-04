import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import api from '../../api';

const ManagerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const managerID = localStorage.getItem("userID");
  // State for analytics, user management, etc., can be added here
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    // Initialize other data here
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${api}/product/all`);
      setProducts(response.data.products);
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

  // Function to handle product deletion
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${api}/product/${productId}`);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Function to handle updating order status (example implementation)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${api}/order/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Container>
      <h1>Manager Dashboard</h1>
      <Row>
        <Col>
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    {/* Replace these with actual edit functionality or modals */}
                    <Button variant="warning">Edit</Button>
                    <Button variant="danger" onClick={() => deleteProduct(product._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h2>Orders</h2>
          {/* Orders Table or List */}
          {/* This can be replaced with a more detailed component */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>${order.amount}</td>
                  <td>{order.status}</td>
                  <td>
                    {/* Replace with dropdown or modal for status update */}
                    <Button variant="info" onClick={() => updateOrderStatus(order._id, 'Shipped')}>Mark as Shipped</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {/* Additional sections for analytics, user management, etc. */}
    </Container>
  );
};

export default ManagerDashboard;
