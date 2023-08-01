import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected ho gya Mongodb Database ${conn.connection.host}`.bgGreen.black
    );
  } catch (err) {
    console.log(`Error mongo db me : ${err}`.bgRed.white);
  }
};

export default connectDB;
