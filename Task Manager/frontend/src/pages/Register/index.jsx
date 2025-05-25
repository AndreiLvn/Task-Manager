import React, { useState } from "react";
import API from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import "../Login/style.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Eroare la inregistrare");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <p className="register-link">
        Ai deja cont?
        <button onClick={() => navigate("/login")}>Login</button>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nume"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Inregistreaza-te
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
