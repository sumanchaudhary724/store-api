import express from "express";
import { compairPassword, hashPassword } from "../helper/bcrypt.js";
import {
  getAdminByEmail,
  getAdminById,
  getAllAdmin,
  insertAdmin,
  updateUser,
  updateAdminById,
} from "../model/User/UserModel.js";
import {
  loginValidation,
  newAdminValidation,
  newAdminVerificationValidation,
} from "../middleware/joiValidation.js";
import {
  accountVerificationEmail,
  accountVerifiedNotification,
  passwordChangedNotification,
  sendOTPNotification,
} from "../helper/nodemailer.js";
import { v4 as uuidv4 } from "uuid";
import { createAcessJWT, createRefreshJWT } from "../helper/jwt.js";
import { auth, refreshAuth } from "../middleware/authMiddleware.js";
import {
  deleteSession,
  deleteSessionByFilter,
  insertNewSession,
} from "../model/session/SessionModel.js";
import { otpGenerator } from "../helper/randomGenerator.js";

const router = express.Router();

// get admin details
router.get("/", auth, (req, res, next) => {
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

router.get("/display", auth, async (req, res, next) => {
  try {
    const user = await getAllAdmin();
    res.json({
      status: "success",
      message: " here is the user Info",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// create new admin api
router.post("/", auth, newAdminValidation, async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = hashPassword(password);

    //TODO create code and add with req.body
    req.body.verificationCode = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    const result = await insertAdmin(req.body);

    if (result?._id) {
      res.json({
        status: "success",
        message:
          "Please check your email and follow the instruction to activate your acount",
      });

      const link = ` ${process.env.WEB_DOMAIN}/admin-verification?c=${result.verificationCode}&e=${result.email}`;

      await accountVerificationEmail({
        fName: result.fName,
        email: result.email,
        link,
      });
      return;
    }

    res.json({
      status: "error",
      message: "Unable to add new admin, Please try agian later",
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.statusCode = 400;
      error.message =
        "This email is already used by another Admin, Use different email or reset your password";
    }

    next(error);
  }
});

//verifiying the new accout
router.post(
  "/admin-verification",
  newAdminVerificationValidation,
  async (req, res, next) => {
    try {
      const { c, e } = req.body;
      const filter = {
        email: e,
        verificationCode: c,
      };
      const updateObj = {
        isVerified: true,
        verificationCode: "",
      };
      const result = await updateUser(filter, updateObj);

      if (result?._id) {
        await accountVerifiedNotification(result);
        res.json({
          status: "success",
          message: "Your account has been verified, you may login now!",
        });

        return;
      }
      res.json({
        status: "error",
        message: "Link is expired or invalid!",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/sign-in", loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find the user by email

    const user = await getAdminByEmail(email);
    if (user?._id) {
      //check the password
      const isMatched = compairPassword(password, user.password);

      if (isMatched) {
        //create 2 jwts:

        const accessJWT = await createAcessJWT(email);
        const refreshJWT = await createRefreshJWT(email);

        //// create accessJWT and store in session table: short live 15m
        //// create refreshJWT and store with user data in user table: long live 30d

        return res.json({
          status: "success",
          message: "logined successfully",
          token: { accessJWT, refreshJWT },
        });
      }
    }

    // return the jwts
    res.json({
      status: "error",
      message: "Invalid login details",
    });
  } catch (error) {
    next(error);
  }
});

// return the refreshJWT
router.get("/get-accessjwt", refreshAuth);

//logout
router.post("/logout", async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT, _id } = req.body;

    accessJWT && deleteSession(accessJWT);

    if (refreshJWT && _id) {
      const dt = await updateAdminById({ _id, refreshJWT: "" });
    }

    res.json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
});

// ===== reseting passowrd
router.post("/request-opt", async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (email) {
      //check user exist

      const user = await getAdminByEmail(email);
      if (user?._id) {
        // create 6 digit otp and sotre in session with email
        const otp = otpGenerator();

        // store opt and email in session table for futur check

        const obj = {
          token: otp,
          associate: email,
        };

        const result = await insertNewSession(obj);
        if (result?._id) {
          // send opt to their email
          await sendOTPNotification({
            otp,
            email,
            fName: user.fName,
          });
        }
      }
    }
    res.json({
      status: "success",
      message:
        "If your email exist in our system, you will get otp to your mailbox. Pelase check your email for the instruction and otp",
    });
  } catch (error) {
    next(error);
  }
});
router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    if (email && password) {
      // check if the token is valid

      const result = await deleteSessionByFilter({
        token: otp,
        associate: email,
      });

      if (result?._id) {
        //check user exist

        const user = await getAdminByEmail(email);
        if (user?._id) {
          // encrypt the password

          const hashPass = hashPassword(password);

          const updatedUser = await updateAdmin(
            { email },
            { password: hashPass }
          );
          if (updatedUser?._id) {
            // send email notification

            await passwordChangedNotification({
              email,
              fName: updatedUser.fName,
            });

            return res.json({
              status: "success",
              message: "Your password has been updated, you may login now.",
            });
          }
        }
      }
    }
    res.json({
      status: "error",
      message: "Invalid request or token",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/profile", auth, newAdminValidation, async (req, res, next) => {
  try {
    // Extract the necessary data from the request body
    const { _id, fName, lName, address, email, phone, password } = req.body;

    // Ensure that you have proper validation and error handling for the input data here
    // ...

    // Call the function to update the user's profile
    const result = await updateAdmin(
      { _id }, // Use _id to identify the user
      { fName, lName, address, email, phone, password } // Update data
    );

    if (result?._id) {
      return res.json({
        status: "success",
        message: "Profile updated",
      });
    } else {
      return res.json({
        status: "error",
        message: "Error updating profile",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Update password
router.put("/profilePassword", async (req, res, next) => {
  try {
    // Extract the necessary data from the request body
    const { _id, newPassword, currentPassword } = req.body;

    // Ensure that you have proper validation and error handling for the input data here
    // ...

    // Check if the current password matches the user's existing password
    const user = await getAdminById(_id); // Implement this function to retrieve user data by ID
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const isMatched = compairPassword(currentPassword, user.password); // Implement the password comparison function
    if (!isMatched) {
      return res.status(401).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Encrypt the new password
    const hashPass = hashPassword(newPassword); // Implement the password hashing function

    // Update the user's password
    const updatedUser = await updateAdminById({ _id, password: hashPass });

    if (updatedUser?._id) {
      return res.json({
        status: "success",
        message: "Password updated successfully",
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Error updating password",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
