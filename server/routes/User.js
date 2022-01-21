const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @route   POST /users
 * @desc    Register a new user
 * @access  Public
 */

router.post("/register", async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (!fullname || !email || !username || !password) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      fullname,
      email,
      username,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 7200,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        username: savedUser.username,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   POST /login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { username_email, password } = req.body;

  if (!username_email || !password) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }
  try {
    // Check for existing user
    const user = await User.findOne({
      username: username_email,
      email: username_email,
    });
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 7200,
    });
    if (!token) throw Error("Couldnt sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
