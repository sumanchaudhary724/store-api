import mongoose from "mongoose";
const mainCategory = new mongoose.model("mainCat", {});
export const getMainCategory = () => {
  return mainCategory.find();
};
