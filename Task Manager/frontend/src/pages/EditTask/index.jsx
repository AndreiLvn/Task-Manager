import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/axios";
import "./style.css";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [reminders, setReminders] = useState([{ unit: "hours", value: 24 }]);
  const [message, setMessage] = useState("");

  const fetchTask = async () => {
    try {
      const { data } = await API.get(`/tasks/${id}`);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description);
      const localISODate = new Date(data.dueDate);
      localISODate.setMinutes(
        localISODate.getMinutes() - localISODate.getTimezoneOffset()
      );
      setDueDate(localISODate.toISOString().slice(0, 16));
      setReminders(
        (data.reminders || []).map((r) => {
          if (typeof r === "number") {
            if (r % 24 === 0) return { unit: "days", value: r / 24 };
            if (Number.isInteger(r)) return { unit: "hours", value: r };
            return { unit: "minutes", value: Math.round(r * 60) };
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Eroare la incarcarea taskului", err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${id}`, {
        title,
        description,
        dueDate,
        reminderFrequency: reminders.map((r) => {
          switch (r.unit) {
            case "days":
              return r.value * 24;
            case "minutes":
              return r.value / 60;
            default:
              return r.value;
          }
        }),
      });

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await API.post(`/tasks/${id}/upload`, formData);
      }

      setMessage("Task actualizat cu succes.");
      fetchTask();
    } catch (err) {
      setMessage("Eroare la actualizare sau upload fisier.");
    }
  };

  const handleReminderChange = (index, key, value) => {
    const newReminders = [...reminders];
    newReminders[index] = {
      ...newReminders[index],
      [key]: key === "value" ? parseInt(value) : value,
    };
    setReminders(newReminders);
  };

  const addReminderField = () =>
    setReminders([...reminders, { unit: "hours", value: 1 }]);

  const removeReminderField = (index) => {
    const newReminders = reminders.filter((_, i) => i !== index);
    setReminders(newReminders);
  };

  const handleDeleteAttachment = async (publicId) => {
    try {
      await API.delete(`/tasks/${id}/attachments/${publicId}`);
      setMessage("Fisier sters cu succes.");
      fetchTask();
    } catch (err) {
      setMessage("Eroare la stergerea fisierului.");
    }
  };

  if (!task) return <p>Se incarca taskul...</p>;

  return (
    <div className="edit-task-container">
      <h2>Editeaza Task</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
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
        <label>Remindere inainte de termen:</label>
        <div className="reminders-section">
          {reminders.map((reminder, index) => (
            <div className="reminder-input" key={index}>
              <input
                type="number"
                value={reminder.value}
                onChange={(e) =>
                  handleReminderChange(index, "value", e.target.value)
                }
                required
              />
              <select
                value={reminder.unit}
                onChange={(e) =>
                  handleReminderChange(index, "unit", e.target.value)
                }
              >
                <option value="minutes">minute</option>
                <option value="hours">ore</option>
                <option value="days">zile</option>
              </select>
              <button
                type="button"
                className="remove-reminder-button small-button"
                onClick={() => removeReminderField(index)}
              >
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addReminderField}>
            + Reminder
          </button>
        </div>

        <label>Fisier optional</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Salveaza modificarile</button>
      </form>

      {message && <p>{message}</p>}

      {task.attachments?.length > 0 && (
        <div className="attachments">
          <h4>Fisiere atasate:</h4>
          <ul>
            {task.attachments.map((att, index) => (
              <li key={index}>
                <a href={att.url} target="_blank" rel="noopener noreferrer">
                  {att.url.split("/").pop()}
                </a>
                <button
                  className="attachment-delete-button small-button"
                  onClick={() => handleDeleteAttachment(att.public_id)}
                >
                  Sterge
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EditTask;
