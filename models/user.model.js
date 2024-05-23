const mongoose = require("mongoose");

const { createToken } = require("../services/jwt");
const { randomBytes, createHmac } = require("node:crypto");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.password = hashedPassword;
  this.salt = salt;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const newhashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== newhashedPassword)
      throw new Error("incorrect Password");

    const token = createToken(user);

    return token;
  }
);

userSchema.static(
  "generateNewPassword",
  async function (email, password, newpassword) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("USer not Found");

    const salt = user.salt;

    const userHashPassword = user.password;

    const newprovidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (newprovidedHash !== userHashPassword)
      throw new Error("Incorrect Password");

    // everything is fine so lets create new Password and create hash for it.

    const updatedPasswordHash = createHmac("sha256", salt)
      .update(newpassword)
      .digest("hex");

    await user.updateOne({ password: updatedPasswordHash });

    return user;
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
