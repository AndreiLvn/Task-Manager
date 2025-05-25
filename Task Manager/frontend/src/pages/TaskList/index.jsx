import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Eroare la incarcarea taskurilor", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data: newTask } = await API.post("/tasks", {
        title,
        description,
        dueDate,
      });

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await API.post(`/tasks/${newTask._id}/upload`, formData);
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      fetchTasks();
    } catch (err) {
      setError("Eroare la crearea taskului sau uploadul fisierului");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Esti sigur ca vrei sa stergi acest task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert("Eroare la stergerea taskului.");
      console.error(err);
    }
  };

  return (
    <div className="tasklist-container">
      <h2>Taskuri</h2>
      <form onSubmit={handleCreate} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Titlu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descriere"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Termen limita</label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Adauga task</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            <strong>{task.title}</strong> –{" "}
            {new Date(task.dueDate).toLocaleString()}
            <br />
            <em>{task.description}</em>
            <div style={{ marginTop: "5px" }}>
              <button onClick={() => navigate(`/tasks/${task._id}/edit`)}>
                Editeaza
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#2c3e50",
                  color: "white",
                }}
                onClick={() => handleDelete(task._id)}
              >
                Sterge
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
