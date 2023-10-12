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

import path from "path";

const __dirname = path.resolve();
console.log(__dirname);
// convert public to static
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(__dirname + "/build"));

// API
import { auth } from "./src/middleware/authMiddleware.js";
import stripeRouter from "./src/router/stripeRouter.js";
import orderRouter from "./src/router/orderRouter.js";
import paymentRouter from "./src/router/paymentRouter.js";
import categoryRouter from "./src/router/categoryRouter.js";
import productRouter from "./src/router/productRouter.js";
import userRouter from "./src/router/userRouter.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/stripe", stripeRouter);

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
