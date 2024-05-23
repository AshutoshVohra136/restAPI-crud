const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/usercrud");
  } catch (error) {
    console.log(`mongo db Error `, error);
  }
}

module.exports = connectDB;
