const mongoose = require("mongoose");

const userpostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    createdBy: {
      type: String,
    },
    // likes:{
    //   type:
    // }
  },
  { timestamps: true }
);

const UserPost = mongoose.model("UserPost", userpostSchema);

module.exports = UserPost;
