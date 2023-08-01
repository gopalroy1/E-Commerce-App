import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./Routes/authRoute.js";
import routerCatagory from "./Routes/CatagoryRoute.js";
import ProductRouter from "./Routes/ProductRoute.js";
import UserRouter from "./Routes/userRoute.js";
import cors from 'cors';

//Configuring env
//No need to define path because it is in the root

dotenv.config();

//database configuration
connectDB();
const app = express();
///Cors

app.use(cors({
    origin: '*'
}));
/////////
//PORT
const PORT = process.env.PORT || 3000;
//Middlewares
app.use(express.json());
app.use(morgan("dev"));

//All routes here
app.use("/api/user", authRoute);
app.use("/api/category",routerCatagory);
app.use("/api/products",ProductRouter);
app.use("/api/user",UserRouter);
//run listen
app.listen(PORT, () => {
  //   console.log(`Server is running at ${PORT}`);
  console.log(
    `Server run ho rha hai on ${process.env.DEV_MODE} at port:  ${PORT}`.bgCyan
      .white
  );
});
