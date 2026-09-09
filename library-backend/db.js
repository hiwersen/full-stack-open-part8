const mongoose = require("mongoose");

const connectToDatabase = async (uri) => {
  //! Do not log the uri
  console.log("Connecting to MongoDB");
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
