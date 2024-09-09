import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
// const ATLAS_URL = process.env.ATLAS_URL;

async function connectDB() {
  try {
    const { connection } = await mongoose.connect(`${MONGO_URL}`);
    console.log(`MongoDB Connected to ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Error connecting to MongoDB");
  }
}

export default connectDB;
