import "./styles.css";

import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSignup = async (data) => {
    const { name, email, password, confirmPassword, role } = data;

    if (password !== confirmPassword) {
      // Handle password mismatch here
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/customer/create-customer",
        { name, email, password, role }
      );

      console.log("API Response:", response.data);
      navigate("/login");
    } catch (error) {
      // Handle signup error here
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center">Sign Up</Card.Title>
          <Form onSubmit={handleSubmit(onSignup)}>
            {/* Name Input */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter name"
              />
              {errors.name && (
                <Form.Text className="text-danger">
                  {errors.name.message}
                </Form.Text>
              )}
            </Form.Group>

            {/* Email Input */}
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                {...register("email", {
                  required: "Email is required",
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                })}
                type="email"
                placeholder="Enter email"
              />
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "Password must contain letters and numbers"
                  }
                })}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            {/* Confirm Password Input */}
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords must match",
                })}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <Form.Text className="text-danger">
                  {errors.confirmPassword.message}
                </Form.Text>
              )}
            </Form.Group>

            {/* Role Dropdown Menu */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select {...register("role", { required: "Role is required" })}>
                <option value="">Select a role</option>
                <option value="customer">customer</option>
                <option value="supplier">supplier</option>
                <option value="manager">manager</option>

                {/* Additional roles can be added here */}
              </Form.Select>
              {errors.role && (
                <Form.Text className="text-danger">
                  {errors.role.message}
                </Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Already have an account? <Link to="/login">Login</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Signup;
