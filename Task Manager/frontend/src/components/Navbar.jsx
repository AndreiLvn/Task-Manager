import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar__logo">Task Manager</div>
      <div className="navbar__links">
        <Link to="/">Home</Link>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/tasks">Tasks</Link>
            <Link to="/account">Account</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
