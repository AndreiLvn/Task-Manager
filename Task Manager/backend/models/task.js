const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  attachments: [
    {
      url: String,
      public_id: String,
    },
  ],
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false },
  reminders: { type: [Number], default: [24] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
