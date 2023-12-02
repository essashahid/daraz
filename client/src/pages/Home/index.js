import "./styles.css";

import React from "react";
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
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to the Management System</h1>
        <p>{`Logged in as ${userName} (${userEmail})`}</p>
      </header>
      <main className="home-content">
        <p>This is the home page, accessible only to logged-in users.</p>
        {/* Additional content and components can be added here */}
      </main>
      <footer className="home-footer">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </footer>
    </div>
  );
};

export default Home;
