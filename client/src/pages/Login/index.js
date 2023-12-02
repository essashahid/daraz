import "./styles.css";

import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../../api";

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
        email: email,
        password: password,
      });

      console.log("Login Response:", response);
      const data = await response.data;

      localStorage.setItem("userID", data?.userID);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("userEmail", data.userEmail);
      localStorage.setItem("role", data.role);

      navigate("/home");
    } catch (error) {
      setLoginError("Invalid credentials");
      console.error("Error during login:", error);
    }
  }

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
          <Card.Title className="text-center">Login</Card.Title>
          <Form onSubmit={handleSubmit(onLogin)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
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

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password", {
                  required: "Password is required",
                  minLength: 8,
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

            <Button className="w-100" variant="primary" type="submit">
              Login
            </Button>

            {loginError && (
              <Form.Text className="text-danger mt-3">{loginError}</Form.Text>
            )}
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          Don't have an account? <Link to="/signup">Signup</Link>
        </Card.Footer>{" "}
      </Card>
    </div>
  );
};

export default Login;
