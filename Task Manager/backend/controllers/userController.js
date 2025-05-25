const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Utilizatorul exista deja" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare la inregistrare" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email sau parola gresita" });
    }
  } catch (error) {
    res.status(500).json({ message: "Eroare la autentificare" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea datelor" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilizatorul nu a fost gasit" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password && req.body.password.length >= 3) {
      user.password = req.body.password;
    }

    await user.save();
    res.json({ message: "Profil actualizat cu succes" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la actualizare" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilizatorul nu a fost gasit" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    const mesaj = `Salut ${user.name},\n\nApasa pe linkul de mai jos pentru a-ti reseta parola:\n\n${resetUrl}\n\nLinkul expira in 1 ora.`;

    await sendEmail(user.email, "Resetare parola", mesaj);

    res.json({ message: "Email de resetare trimis cu succes!" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la resetarea parolei" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token invalid sau expirat" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Parola a fost resetata cu succes!" });
  } catch (err) {
    res.status(500).json({ message: "Eroare la salvarea noii parole" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
