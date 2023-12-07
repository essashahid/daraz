import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  Text,
  Select
} from '@mantine/core';
import api from '../../api';

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSignup = async (data) => {
    try {
      const response = await axios.post(`${api}/user/signup`, data);
      const userData = await response.data;

      // Storing user data in local storage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userID", userData?.userID);
      localStorage.setItem("userName", userData.userName);
      localStorage.setItem("userEmail", userData.userEmail);

      navigate('/home');
    } catch (error) {
      // Handle error
    }
  };

  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper style={{ width: 400, padding: '20px' }}>
        <Title order={2} align="center">Sign Up</Title>
        <form onSubmit={handleSubmit(onSignup)}>
          {/* Name Input */}
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />

          {/* Email Input */}
          <TextInput
          label="Email address"
          placeholder="Enter email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email format'
            }
          })}
          error={errors.email?.message}
          mt="md"
        />
          {/* Password Input */}
          <PasswordInput
            label="Password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, message: 'Password must contain letters and numbers' },
            })}
            error={errors.password?.message}
            mt="md"
          />

          {/* Confirm Password Input */}
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) => value === watch('password') || 'Passwords must match',
            })}
            error={errors.confirmPassword?.message}
            mt="md"
          />

          {/* Role Select */}
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <Select
                label="Role"
                placeholder="Select a role"
                {...field}
                data={[
                  { value: 'customer', label: 'Customer' },
                  { value: 'supplier', label: 'Supplier' },
                  { value: 'manager', label: 'Manager' },
                ]}
                error={errors.role?.message}
                mt="md"
              />
            )}
          />

          <Button fullWidth mt="xl" type="submit">
            Sign Up
          </Button>
        </form>
        <Text align="center" mt="md">
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </Paper>
    </div>
  );
};

export default Signup;
