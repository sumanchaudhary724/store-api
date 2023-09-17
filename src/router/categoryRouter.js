import express from "express";
import { getCategories } from "../model/category/category.js";
import { getMainCategory } from "../model/mainCategory/mainCat.js";
const router = express.Router();
router.get("/", async (req, res, next) => {
  try {
    const data = await getCategories();
    const result = await getMainCategory();
    data
      ? res.status(201).json({ status: "success", data, result })
      : res.sendStatus("403");
  } catch (error) {
    next(error);
  }
});
export default router;
