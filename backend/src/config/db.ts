import mongoose from "mongoose";
const mongoURL = process.env.MONGO_URL!;

async function connectDB() {
  await mongoose.connect(mongoURL);
}

export default connectDB;
