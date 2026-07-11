const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "Username already Taken"],
  },
  email: {
    type: String,
    unique: [true, "Account already exist"],
    required: true,
  },

  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: Number, default: null },
  otpExpiry: Number
});

//creating user named collection in database using the userSchema
const userModal = mongoose.model("Users", userSchema);

module.exports = userModal;
