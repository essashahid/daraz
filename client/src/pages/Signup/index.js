import "./styles.css";

import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../../api";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSignup = async (data) => {
    try {
      const response = await axios.post(`${api}/user/signup`, data);
      const userData = await response.data;

      localStorage.setItem("token", userData.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userID", userData?.userID);
      localStorage.setItem("userName", userData.userName);
      localStorage.setItem("userEmail", userData.userEmail);

      navigate("/home");
    } catch (error) {}
  };

  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/home" />;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center">Sign Up</Card.Title>
          <Form onSubmit={handleSubmit(onSignup)}>
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

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "Password must contain letters and numbers",
                  },
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

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select a role</option>
                <option value="customer">customer</option>
                <option value="supplier">supplier</option>
                <option value="manager">manager</option>
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
