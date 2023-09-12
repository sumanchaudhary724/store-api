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

export const createUserWithRefreshToken = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Hash the password and other necessary user data
    const hashedPassword = hashPassword(password);

    // Create a new user record in your database
    const newUser = {
      email,
      password: hashedPassword,
      // Add other user data as needed
    };

    const result = await insertUser(newUser);

    if (result?._id) {
      // Generate access and refresh tokens for the newly registered user
      const accessJWT = createAcessJWT(result.email);
      const refreshJWT = createRefreshJWT(result.email);

      // Store the refresh token in your database
      await updateUser({ email: result.email }, { refreshJWT });

      // Return both tokens in the registration response
      return res.json({
        status: "success",
        message: "User registered successfully",
        tokens: {
          accessJWT,
          refreshJWT,
        },
      });
    }

    res.json({
      status: "error",
      message: "Unable to register user. Please try again later.",
    });
  } catch (error) {
    next(error);
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
