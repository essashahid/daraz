import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Form} from 'react-bootstrap';
import api from '../../api';
// import Form


const SupplierDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const supplierId = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [customProductRating, setCustomProductRating] = useState('');
  const [customProductInStock, setCustomProductInStock] = useState('');




  // console.log("Supplier ID:", supplierId); // Log Supplier ID
  // console.log("Token:", token); // Log Supplier ID

  

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []); // Dependencies array is empty, so this runs once after initial render

  const fetchProducts = useCallback(async () => {
    if (supplierId) 
    {
      console.log("Fetching products for supplier:", supplierId);
      try {
        const response = await axios.get(
          `${api}/product/supplier-products/${supplierId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const products = response.data.data;

        setProducts(products);
      } catch (error) {
        console.error("Error fetching suppliers products by id:", error);
        // setProducts([]);
      }
    }
  }, [supplierId, token]);

  const fetchOrders = useCallback(async () => {
    if (supplierId) {
      console.log("Fetching orders for supplier:", supplierId);
      try {
        const response = await axios.get(
          `${api}/order/supplier-orders/${supplierId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Orders response:", response.data.data); // Log the response data
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders by suppliers id:", error);
        setOrders([]);
      }
    }
  }, [supplierId, token]);

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


  return (
    <Container>
      <h1>Supplier Dashboard</h1>
      <Row>
        <Col>
          <h2>Your Products</h2>
          <Button onClick={createRandomProduct} className="mb-3">
            Create Random Product
          </Button>
          <Form onSubmit={createCustomProduct} className="mb-3">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={customProductPrice}
                onChange={(e) => setCustomProductPrice(e.target.value)}
                placeholder="Enter price"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                value={customProductRating}
                onChange={(e) => setCustomProductRating(e.target.value)}
                placeholder="Enter rating"
              />
            </Form.Group>
            <Form.Group>
            <Form.Label>In Stock</Form.Label>
            <Form.Control
              type="number" // Change type to number
              min="0" // Optional: Ensure no negative values
              value={customProductInStock}
              onChange={(e) => setCustomProductInStock(e.target.value)}
              placeholder="Enter stock availability"
            />
          </Form.Group>
            <Button type="submit">Create Custom Product</Button>
          </Form>
          <Table striped bordered hover>
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
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col>
          <h2>Orders</h2>
          <Table striped bordered hover>
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
        </Col>
      </Row>
    </Container>
  );
};

export default SupplierDashboard;