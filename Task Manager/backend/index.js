const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./models/config.js");
const configureRoutes = require("./routes/config.js");
const { scheduleAllReminders } = require("./utils/reminder_scheduler.js");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

configureRoutes(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  scheduleAllReminders();
});
