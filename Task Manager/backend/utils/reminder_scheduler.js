const cron = require("node-cron");
const Task = require("../models/task.js");
const sendEmail = require("./sendEmail.js");

let reminderJobs = {};

const clearReminderJobs = () => {
  Object.values(reminderJobs).forEach((jobs) => {
    jobs.forEach((job) => job.stop());
  });
  reminderJobs = {};
};

const scheduleReminderForTask = (task) => {
  const { _id, title, dueDate, userId, reminders = [] } = task;

  if (!userId || !userId.email || !Array.isArray(reminders)) return;

  if (reminderJobs[_id]) {
    reminderJobs[_id].forEach((job) => job.stop());
  }

  reminderJobs[_id] = [];

  reminders.forEach((hoursBefore) => {
    const reminderTime = new Date(
      new Date(dueDate).getTime() - hoursBefore * 60 * 60 * 1000
    );

    if (reminderTime <= new Date()) return;

    const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${
      reminderTime.getMonth() + 1
    } *`;

    const job = cron.schedule(cronTime, async () => {
      const mesaj = `Salut ${
        userId.name
      },\n\nTaskul "${title}" are termen limita pe ${new Date(
        dueDate
      ).toLocaleString()}.`;
      await sendEmail(userId.email, "Reminder task", mesaj);
      job.stop();
    });

    reminderJobs[_id].push(job);
  });
};

const scheduleAllReminders = async () => {
  clearReminderJobs();
  const tasks = await Task.find({}).populate("userId");
  tasks.forEach(scheduleReminderForTask);
};

module.exports = {
  scheduleAllReminders,
  scheduleReminderForTask,
};
