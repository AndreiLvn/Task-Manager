const express = require("express");
const multer = require("multer");
const stream = require("stream");

const { protect } = require("../middlewares/authMiddleware.js");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController.js");

const cloudinary = require("../utils/cloudinary.js");
const Task = require("../models/task.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/").get(protect, getTasks).post(protect, createTask);

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.post("/:id/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({ message: "Taskul nu a fost gasit" });

    const file = req.file;
    if (!file) return res.status(400).json({ message: "Niciun fisier trimis" });

    const originalName = file.originalname;

    const uploadResult = cloudinary.uploader.upload_stream(
      {
        folder: "task_manager_uploads",
        resource_type: "raw",
        filename_override: originalName,
        use_filename: true,
        unique_filename: false,
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Eroare la upload", error });
        }

        task.attachments.push({
          url: result.secure_url,
          public_id: result.public_id,
          filename: originalName,
        });

        await task.save();
        res
          .status(200)
          .json({ message: "Fisier incarcat", file: result.secure_url });
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadResult);
  } catch (error) {
    res.status(500).json({ message: "Eroare interna", error });
  }
});

router.delete("/:id/attachments/:publicId(*)", protect, async (req, res) => {
  const { id, publicId } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ message: "Taskul nu a fost gasit" });

    const cloudinaryRes = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    if (cloudinaryRes.result !== "ok" && cloudinaryRes.result !== "not found") {
      return res
        .status(500)
        .json({ message: "Eroare la stergerea din Cloudinary" });
    }

    task.attachments = task.attachments.filter(
      (att) => att.public_id !== publicId
    );
    await task.save();

    res.status(200).json({ message: "Fisier sters cu succes" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Eroare la stergerea fisierului", error: err });
  }
});

module.exports = router;
