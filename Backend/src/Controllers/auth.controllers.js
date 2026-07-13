const userModal = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModal = require("../models/blacklist");
const { sendEmail } = require("../services/email.service");

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description register a new user, expects username, email,pass in req body
 * @access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  // Validate that all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check if user already exist with the same username or email
  const isUserAlreadyExist = await userModal.findOne({
    // $or takes an array of conditions.
    // { username } is shorthand for { username: username }.
    // { email } is shorthand for { email: email }
    $or: [{ username }, { email }],
  });

  // If a user is found, check which field is causing the conflict and return an appropriate message
  if (isUserAlreadyExist) {
    if (isUserAlreadyExist.username === username) {
      return res.status(400).json({ message: "Username already taken" });
    }
    if (isUserAlreadyExist.email === email) {
      return res.status(400).json({
        message: "Account already exist with this email",
      });
    }
  }

  // Hash the password before saving to the database
  const hashPassword = await bcrypt.hash(password, 10);

  const isProduction = process.env.NODE_ENV === "production";

  // In production, skip OTP and auto-verify
  if (isProduction) {
    const user = await userModal.create({
      username,
      email,
      password: hashPassword,
      isVerified: true,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, username: user.username, email: user.email, verified: true },
    });
  }

  const otp = Math.floor(Math.random() * 900000) + 100000;

  const user = await userModal.create({
    username,
    email,
    password: hashPassword,
    otp: otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendEmail(email, otp);

  res.status(201).json({
    message: "Otp send to the email, Verify your email",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.isVerified,
    },
  });
}

/**
 * @name emailVerificationController
 * @description verify a user emails , expect email and 6 digit otp
 * @acess public
 */

async function emailVerificationController(req, res) {
  const { email, otp } = req.body;
  console.log("backend otp verification controller", email, otp);
  const user = await userModal.findOne({ email });
  console.log("backend otp verification controller user", user);
  console.log("otp matching", user.otp, Number(otp), user.otp === Number(otp));
  console.log(
    "otp expiry",
    user.otpExpiry,
    Date.now(),
    user.otpExpiry < Date.now(),
  );
  if (!user) {
    return res.status(400).json({ message: "User not found", success: false });
  }
  if (user.isVerified) {
    return res.status(400).json({
      message: "Email already verified",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        verified: user.isVerified,
      },
    });
  }

  if (user.otp !== Number(otp)) {
    return res.status(400).json({ message: "Invalid OTP", success: false });
  }
  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: "OTP expired", success: false });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  // Generate a JWT token for the newly registered user
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.SECRET,
    { expiresIn: "1d" },
  );

  // Set the token in a cookie and send a success response
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Email verified",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      verified: user.isVerified,
    },
  });
}

/**
 * @name loginUserController
 * @description login a user, expects email and password
 * @access Public
 */

async function loginUserController(req, res) {
  const { email, password } = req.body;

  //fetching the user
  const user = await userModal.findOne({ email });

  //validating the user exists
  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid email or password", success: false });
  }
  //validating the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Invalid email or password", success: false });
  }

  // Check if the user's email is verified
  if (!user.isVerified) {
    if (process.env.NODE_ENV === "production") {
      await userModal.findByIdAndUpdate(user._id, { isVerified: true });
      user.isVerified = true;
    } else {
      const otp = Math.floor(Math.random() * 900000) + 100000;

      await userModal.findOneAndUpdate(
        { email },
        { otp, otpExpiry: Date.now() + 10 * 60 * 1000 },
      );

      await sendEmail(email, otp);
      return res.status(200).json({
        message: "Email not verified, OTP sent to email",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          verified: user.isVerified,
        },
      });
    }
  }

  // Generate a JWT token for the logged-in user
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.SECRET,
    { expiresIn: "1d" },
  );

  // Set the token in a cookie and send a success response
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      verified: user.isVerified,
    },
  });
}

/**
 * @name logoutUserController
 * @description delete the token and blacklist the user token
 * @access Public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;
  console.log(req.header.cookie);
  if (token) {
    await blacklistModal.create({ token });
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } else {
    res.status(400).json({ message: "No token found" });
  }
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access Private
 */
async function getMeController(req, res) {
  //getting the user details from the database using the user id from the token
  // which is set in req.user by the auth middleware after verifying the token
  const user = await userModal.findById(req.user.userId);

  res.status(200).json({
    message: "user details fetched successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      verified: user.isVerified,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  emailVerificationController,
};
