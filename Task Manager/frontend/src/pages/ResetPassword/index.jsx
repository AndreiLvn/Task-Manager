import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/axios";
import "./style.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/users/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Eroare la resetare");
    }
  };

  return (
    <div className="login-container">
      <h2>Seteaza o parola noua</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Parola noua"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="reset-button" type="submit">
          Reseteaza parola
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
