import React, { useState } from "react";
import API from "../../utils/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Eroare la trimiterea emailului"
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Resetare Parola</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Emailul tău"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="reset-button" type="submit">
          Trimite link de resetare
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
