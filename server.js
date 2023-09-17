import express from "express";
const app = express();
const PORT = process.env.PORT || 8001;

import dotenv from "dotenv";
dotenv.config();

//middlewares
import morgan from "morgan";
import cors from "cors";
import mongoConnect from "./src/config/mongoConfig.js";

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

mongoConnect();

// API
import { auth } from "./src/middleware/authMiddleware.js";
import categoryRouter from "./src/router/categoryRouter.js";
import productRouter from "./src/router/productRouter.js";
import userRouter from "./src/router/userRouter.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server running well",
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const code = error.statusCode || 500;
  res.status(code).json({
    status: "error",
    message: error.message,
    code,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`);
});
