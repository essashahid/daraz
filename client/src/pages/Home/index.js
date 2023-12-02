import "./styles.css";

import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  console.log("Retrieved user info:", userName, userEmail);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div>
        <h1>Welcome to the Management System</h1>
        <p>{`Logged in as ${userName} (${userEmail})`}</p>
      </div>

      <p>This is the home page, accessible only to logged-in users.</p>

      <div className="d-flex gap-2">
        <Button
          onClick={() => {
            navigate("/customer-dashboard");
          }}
        >
          Customer Dashboard
        </Button>

        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </Container>
  );
};

export default Home;
