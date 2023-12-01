import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/customer/login', {
        email: email,
        password: password,
      });
      console.log('Login Response:', response);


      console.log('API Response:', response.data);

      // Store the token, user's name, and email in local storage upon successful login
      console.log('Storing user info:', response.data.userName, response.data.userEmail);
      localStorage.setItem('token', response.data.token); // Assuming token is part of the response
      localStorage.setItem('userName', response.data.userName); // Assuming userName is part of the response
      localStorage.setItem('userEmail', response.data.userEmail); // Assuming userEmail is part of the response

      navigate('/home'); // Redirect to the home page
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
      console.error('Error making API request:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        Management <span className="lib-name">System</span>
      </div>
      <form className="form" onSubmit={handleLogin}>
        <div>
          <input
            className="user-inp"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="pass-inp"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="sub-button">
            Login
          </button>
        </div>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="question">
        Don't have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
};

export default Login;
