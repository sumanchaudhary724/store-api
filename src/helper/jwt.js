import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/SessionModel.js";
import { updateUser } from "../model/User/UserModel.js";

export const createAcessJWT = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    await insertNewSession({ token, associate: email });
    return token;
  } catch (error) {
    console.error("Error creating access JWT:", error);
    throw new Error("Unable to create access token");
  }
};

export const verifyAccessJWT = (token) => {
  if (!token) {
    throw new Error("Access token is missing");
  }

  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    console.error("Error verifying access JWT:", error);
    throw new Error("Invalid access token");
  }
};

export const createRefreshJWT = async (email) => {
  const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  const dt = await updateUser({ email }, { refreshJWT });

  return refreshJWT;
};

export const verifyRefreshJWT = (token) => {
  if (!token) {
    throw new Error("Refresh token is missing");
  }

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error("Error verifying refresh JWT:", error);
    throw new Error("Invalid refresh token");
  }
};
