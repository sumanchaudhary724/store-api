import mongoose from "mongoose";
const categories = new mongoose.model("categories", {});
export const getCategories = () => {
  return categories.find({ status: "active" });
};
