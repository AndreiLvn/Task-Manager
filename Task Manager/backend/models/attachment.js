const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attachment", attachmentSchema);
