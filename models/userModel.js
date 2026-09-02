const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a user must have a name!"],
    trim: true,
    minLength: [4, "Name must be at least 10 characters"],
    maxLength: [40, "Name must be maximum 40 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "a user must have an email"],
    trim: true,
    minLength: [10, "Email must be at least 10 characters"],
    maxLength: [80, "Email must be maximum 80 characters"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "guide", "lead-guide"],
      message: "Role must be user, admin, guide, or lead-guide",
    },
    default: "user",
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    trim: true,
    minLength: [12, "Password must be at least 10 characters"],
    maxLength: [80, "Password must be maximum 80 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false, // Hide this field and only use internally
  },
  slug: String,
})

const User = mongoose.model("User", userSchema)

module.exports = User
