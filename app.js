require("dotenv").config();

const express = require("express");
const connectDb = require("./db");
const UserPost = require("./models/userPost.model");
connectDb();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const userRoutes = require("./routes/user.routes");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT;

app.use("/user", userRoutes);
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => res.json({ user: req.user }));

app.get("/userpost", async (req, res) => {
  const allPost = await UserPost.find({});

  return res.status(200).json({ "All-Post": allPost });
});

app.post("/userpost", async (req, res) => {
  const { content, createdBy } = req.body;
  const userpost = await UserPost.create({ content, createdBy });
  return res.status(201).json({ message: "Post Created", userPost: userpost });
});

app.put("/userpost/update/:id", async (req, res) => {
  try {
    let userPost = await UserPost.findById(req.params.id);
    if (!userPost) return res.status(404).json({ message: "Post Not Found" });

    userpost = await UserPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({ userpost: userpost });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/userpost/delete/:id", async (req, res) => {
  try {
    let userpost = await UserPost.findById(req.params.id);
    if (!userpost) return res.status(404).json({ message: "Post Not Found" });

    const userPost = await UserPost.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});
app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
