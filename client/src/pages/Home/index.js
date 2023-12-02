import "./styles.css";

import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  function getLabel() {
    if (role === "customer") {
      return "Do Some Shopping";
    } else if (role === "manager") {
      return "Manager Dashboard";
    } else if (role === "supplier") {
      return "Supplier Dashboard";
    } else {
      return "Dashboard";
    }
  }
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
            if (role === "customer") navigate("/customer-dashboard");
            if (role === "manager") navigate("/manager-dashboard");
            if (role === "supplier") navigate("/supplier-dashboard");

            navigate("/customer-dashboard");
          }}
        >
          {getLabel()}
        </Button>

        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </Container>
  );
};

export default Home;
