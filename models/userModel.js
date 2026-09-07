const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a user must have a name!"],
    minLength: [4, "Name must be at least 4 characters"],
    maxLength: [40, "Name must be maximum 40 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "a user must have an email"],
    trim: true,
    minLength: [8, "Email must be at least 8 characters"],
    maxLength: [80, "Email must be maximum 80 characters"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
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
  photo: String,
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false, // shouldn't send back passwords in requests
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    minLength: [8, "Password must be at least 8 characters"],
    // This validation only works on save or create
    validate: {
      validator: function (el) {
        return el === this.password
      },
      message: "Passwords do not match",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false, // Hide this field and only use internally
  },
})

userSchema.pre("save", async function () {
  // Only run this prehook when the password is actually updated
  if (!this.isModified("password")) return

  // hash is the async method and 2 params are the password and salt cost (complexity)
  this.password = await bcrypt.hash(this.password, 12)
  // delete passwordConfirm field
  this.passwordConfirm = undefined
})

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidate, hashed) {
  return await bcrypt.compare(candidate, hashed)
}

const User = mongoose.model("User", userSchema)

module.exports = User
