import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    conn && console.log("Mongodb is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
