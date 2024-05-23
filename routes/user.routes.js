const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
router.get("/getUsers", async (req, res) => {
  const users = await User.find({});
  return res.json({ users: users });
});

router.get("/signout", (req, res) => {
  return res.clearCookie("token").json({ message: "Signout successful" });
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User Not Found" });

    // user found

    // if (req.body.email) user.email = req.body.email;

    // if (req.body.password) user.password = req.body.password;

    // if (req.body.userName) user.userName = req.body.userName;
    // user.save();

    //easy way
    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }

  res.end();
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not Found" });

    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/getUser/:id", async (req, res) => {
  // console.log(req.params.id);

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
// this is also working but we gonna use diff method and write some code in
//  static function in model(VIRTULA FUN)

// router.post("/signin", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.status(404).json({ message: "User Not Found." });

//   const salt = user.salt;

//   const hashedPassword = user.password;

//   const userProvidedPassword = crypto
//     .createHmac("sha256", salt)
//     .update(password)
//     .digest("hex");

//   if (userProvidedPassword !== hashedPassword)
//     return res.status(401).json({ message: "Wrong Password." });

//   const token = createToken(user);

//   return res
//     .cookie(token)
//     .status(201)
//     .json({ user: user, message: "User LoggedIn", token: token });
// });

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res
      .status(200)
      .cookie("token", token)
      .json({ message: "Logged in" });
  } catch (error) {
    return res.json({ error: "incorrect Email or Password" });
  }
});

router.post("/singup", async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await User.create({
    userName,
    email,
    password,
  });

  return res.status(201).json({ user: user, message: "User Created" });
});

router.post("/forget", async (req, res) => {
  const { email, password, newpassword } = req.body;
  try {
    const user = await User.generateNewPassword(email, password, newpassword);
    return res.status(200).json({
      message: "Pasword Updated Successfully Use new password to login. ",
      user: user,
    });
  } catch (error) {
    return res.json({ error: "incorrect Email or Password" });
  }
});

module.exports = router;
