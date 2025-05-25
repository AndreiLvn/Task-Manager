import React, { useState } from "react";
import API from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Eroare la autentificare");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <p className="register-link">
        Nu ai cont?
        <button onClick={() => navigate("/register")}>Inregistreaza-te</button>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Autentificare
        </button>
        {error && <p>{error}</p>}
      </form>
      <p className="forgot-password-link">
        <button onClick={() => navigate("/forgot-password")}>
          Ti-ai uitat parola?
        </button>
      </p>
    </div>
  );
};

export default Login;
