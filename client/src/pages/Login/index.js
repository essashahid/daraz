import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { TextInput, PasswordInput, Paper, Title, Button, Text } from '@mantine/core';
import api from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = React.useState(null);

  async function onLogin(data) {
    const { email, password } = data;

    try {
      const response = await axios.post(`${api}/user/login`, {
        email,
        password,
      });

      const responseData = response.data;

      // Storing user data in local storage
      localStorage.setItem("userID", responseData?.userID);
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userName", responseData.userName);
      localStorage.setItem("userEmail", responseData.userEmail);
      localStorage.setItem("role", responseData.role);

      navigate('/home');
    } catch (error) {
      setLoginError('Invalid credentials');
      console.error('Error during login:', error);
    }
  }

  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper style={{ width: 400, padding: '20px' }}>
        <Title order={2} align="center">Login</Title>
        <form onSubmit={handleSubmit(onLogin)}>
          <TextInput
            label="Email address"
            placeholder="Enter email"
            {...register('email', {
              required: 'Email is required',
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: 8,
            })}
            error={errors.password?.message}
            mt="md"
          />

          <Button fullWidth mt="xl" type="submit">
            Login
          </Button>

          {loginError && <Text color="red" mt="sm">{loginError}</Text>}
        </form>
        <Text align="center" mt="md">
          Don't have an account? <Link to="/signup">Signup</Link>
        </Text>
      </Paper>
    </div>
  );
};

export default Login;
