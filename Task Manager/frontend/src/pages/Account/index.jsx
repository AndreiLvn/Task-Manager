import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";
import "./style.css";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchUser = async () => {
      try {
        const res = await API.get("/users/profile");
        setUser({ ...res.data, password: "" });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put("/users/profile", user);
      setMessage("Datele au fost actualizate cu succes!");
    } catch (err) {
      setMessage("Eroare la actualizare date");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="account-container">
      <h2>Contul meu</h2>

      <label>Nume</label>
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
      />

      <label>Parola (noua)</label>
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Lasa necompletat daca nu vrei sa o schimbi"
      />

      {message && <p>{message}</p>}

      <button onClick={handleUpdate}>Salveaza modificarile</button>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Account;
