const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

const JWT_SECRET = "surge-jwt-secret";

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
      $or: [
        {
          email: username_email,
        },
        {
          username: username_email,
        },
      ],
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

/**
 * @route   GET api/user/profile
 * @desc    POST user data
 * @access  Private
 */
router.post("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("User does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   GET api/user/change-details
 * @desc    PUT change user details
 * @access  Private
 */
router.put("/change-details", auth, async (req, res) => {
  //destructure data
  const { fullname, email, username } = req.body;

  const newUserData = {
    fullname,
    email,
    username,
  };

  User.findByIdAndUpdate(req.user.id, newUserData, function (err, response) {
    // Handle any possible errors
    if (err) {
      res.status(400).json({ msg: err.message });
    } else {
      res.status(200).json({ status: "User updated" });
    }
  });
});
router.put("/change-password", auth, async (req, res) => {
  //destructure data
  const { password } = req.body;

  if (!password && password.length < 4) {
    return res.status(400).json({ msg: "Invalid password" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const user_id = req.user.id;

    await User.updateOne(
      { user_id },
      {
        $set: { password: hash },
      }
    );
    res.json({ status: "password update successfully" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
