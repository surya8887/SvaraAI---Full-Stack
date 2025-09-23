import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");
  await mongoose.connect(uri, {
    // mongoose 7 uses sane defaults; keep here if you want
  });
  console.log("MongoDB connected");
};

export default connectDB;
