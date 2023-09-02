import express from "express";
import { compairPassword, hashPassword } from "../helper/bcrypt.js";

const router = express.Router();

// get admin details
router.get("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "here is the user info",
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});
