import express from "express";
import {
  getProducts,
  getProductsByCatagory,
  getSingleProduct,
} from "../model/product/productModel.js";

const router = express.Router();
router.get("/:slug?/", async (req, res) => {
  try {
    const { slug } = req.params;
    req.params.status = "active";
    const data = slug
      ? await getSingleProduct(req.params)
      : await getProducts({ status: "active" });
    data
      ? res.json({
          status: "success",
          data,
        })
      : res.json({
          status: "error",
          message: `No product found with ${slug}`,
        });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});
router.get("/categories/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await getProductsByCatagory(_id);
    result.length
      ? res.json({
          status: "success",
          result,
        })
      : res.json({
          status: "error",
          message: `No product found with ${slug || "_id"}`,
        });
  } catch (error) {
    res.json({ error });
  }
});
export default router;
