require("dotenv").config();

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendEmail = async (to, subject, text) => {
  const sentFrom = new Sender(
    "hello@test-xkjn41mz9154z781.mlsender.net",
    "Task Manager App"
  );
  const recipients = [new Recipient(to, "Utilizator Task Manager")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text);

  try {
    await mailersend.email.send(emailParams);
    console.log(`Email trimis cu succes catre: ${to}`);
  } catch (err) {
    console.error(
      "Eroare la trimiterea emailului:",
      err?.response?.body || err.message || err
    );
  }
};

module.exports = sendEmail;
