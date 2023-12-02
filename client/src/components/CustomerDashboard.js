import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log('Fetching products...');
    axios.get('http://localhost:3000/product/search?q=')
      .then(response => {
        console.log('Products fetched:', response.data.data);
        setProducts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Retrieve and decode JWT
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const customerId = decoded.customerId;
        fetchOrders(customerId);
      } else {
        console.log('No token found or token is invalid');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, []);

  const fetchOrders = async (customerId) => {
    console.log('fetchOrders called with customerId:', customerId);
    try {
      const response = await axios.get(`http://localhost:3000/order/get-orders-by-customer/${customerId}`);
      console.log('Orders fetched:', response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
      const orderDate = new Date().toISOString();
      const supplierId = "656a58696679a30113fe3cc5";
      const managerId = '656a57b84e1e38ed89796f25';

      const token = localStorage.getItem('token');
      let customerId;

      if (token) {
        const decoded = jwtDecode(token);
        customerId = decoded.customerId;
      }

      if (!customerId) {
        alert('Customer ID is not available');
        return;
      }



      const orderResponse = await axios.post('http://localhost:3000/order/create-order', {
        date: orderDate,
        amount: totalAmount,
        cid: customerId,
        sid: supplierId,
        mid: managerId
      });

      await Promise.all(cart.map(item => {
        return axios.post('http://localhost:3000/orderdetails/add-order-details', {
          oid: orderResponse.data.data._id,
          pid: item._id,
          supplierId: item.supplierId
        });
      }));

      setCart([]);
      fetchOrders(); // Fetch orders again to update the list
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order.');
    }
  };

  return (
    <div className="customer-dashboard">
      <h1>Customer Dashboard</h1>
      <div className="products">
        {products.map(product => (
          <div key={product._id} className="product">
            <h3>{product.name}</h3>
            <p>Rating: {product.rating}</p>
            <p>Price: ${product.price}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="cart">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <p>{item.name}</p>
            <button className="remove-from-cart-btn" onClick={() => removeFromCart(item._id)}>
              Remove from Cart
            </button>
          </div>
        ))}
        {cart.length > 0 && (
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        )}
      </div>
      <div className="orders">
        <h2>Your Orders</h2>
        {orders.map(order => (
          <div key={order._id} className="order">
            <p>Order ID: {order._id}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Total Amount: ${order.amount}</p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
