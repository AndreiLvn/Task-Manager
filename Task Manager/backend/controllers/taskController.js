const Task = require("../models/task.js");
const { scheduleReminderForTask } = require("../utils/reminder_scheduler.js");

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, reminderFrequency } = req.body;
    const userId = req.user.id;

    const task = new Task({
      title,
      description,
      dueDate,
      reminderFrequency: Array.isArray(reminderFrequency)
        ? reminderFrequency
        : [],
      userId,
    });

    const savedTask = await task.save();
    await task.populate("userId");
    scheduleReminderForTask(savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Eroare la crearea taskului", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    if (updates.dueDate && typeof updates.dueDate === "string") {
      updates.dueDate = new Date(updates.dueDate);
    }

    if (Array.isArray(updates.reminderFrequency)) {
      updates.reminders = updates.reminderFrequency
        .map((r) => {
          if (typeof r === "number") return r;
          if (!r || typeof r.value !== "number") return null;
          switch (r.unit) {
            case "days":
              return r.value * 24;
            case "minutes":
              return r.value / 60;
            default:
              return r.value;
          }
        })
        .filter((r) => r !== null);
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    }).populate("userId");

    if (!updatedTask) {
      return res.status(404).json({ message: "Taskul nu a fost gasit" });
    }

    scheduleReminderForTask(updatedTask);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Eroare la actualizarea taskului", error });
  }
};

module.exports = {
  createTask,
  updateTask,
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task)
        return res.status(404).json({ message: "Taskul nu a fost gasit" });
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: "Eroare la obtinerea taskului", err });
    }
  },
  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user.id });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Eroare la obtinerea taskurilor", err });
    }
  },
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task)
        return res.status(404).json({ message: "Taskul nu a fost gasit" });
      res.json({ message: "Task sters" });
    } catch (err) {
      res.status(500).json({ message: "Eroare la stergerea taskului", err });
    }
  },
};
