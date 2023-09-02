import UserSchema from "./UserSchema.js";

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

export const getOneUser = (filter) => {
  return UserSchema.findOne(filter);
};

export const getAllUser = () => {
  return UserSchema.find();
};

export const updateUserById = ({ _id, ...rest }) => {
  return UserSchema.findByIdAndUpdate(_id, rest);
};

//@filter and @updateObj must ne an obj
export const updateUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj, { new: true });
};

export const deleteUser = (_id) => {
  return UserSchema.findByIdAndDelete(_id);
};
