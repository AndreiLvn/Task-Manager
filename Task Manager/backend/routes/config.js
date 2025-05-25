const taskRoutes = require("./taskRoutes.js");
const userRoutes = require("./userRoutes.js");

module.exports = (app) => {
  app.use("/api/tasks", taskRoutes);
  app.use("/api/users", userRoutes);
};
