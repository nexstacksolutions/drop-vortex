import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/dropVortex"; // Default URL

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB Connected to ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process on connection failure
  }
}

export default connectDB;
