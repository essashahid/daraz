import React from "react";
import { Button, Container, Text, Group, Title } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import "./styles.css";

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
    <Container size="xs" className="home-container">
      <Title order={1}>Welcome to Daraz Management System</Title>
      {/* display Logo here */}
      {/* path of image in folder*/}

      <Text size="lg">{`Logged in as ${userName} (${userEmail})`}</Text>

      <Text size="md">This is the home page, accessible only to logged-in users.</Text>

      <Group position="center" mt="md">
        <Button
          onClick={() => {
            if (role === "customer") navigate("/customer-dashboard");
            if (role === "manager") navigate("/manager-dashboard");
            if (role === "supplier") navigate("/supplier-dashboard");
          }}
        >
          {getLabel()}
        </Button>

        <Button onClick={handleLogout}>Logout</Button>
      </Group>
    </Container>
  );
};

export default Home;