// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");

authRouter.get("/", authController.getHomePage);
authRouter.get("/login", authController.getLogIn);
authRouter.post("/login", authController.postLogIn);
authRouter.post("/logout", authController.postLogOut);

authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignUp);
authRouter.get("/add-admin", authController.getAddAdmin);
authRouter.post("/add-admin", authController.postAddAdmin);
authRouter.get("/edit-profile", authController.getEditProfile);
authRouter.post("/profile/update", authController.postUpdateProfile);
authRouter.post("/check-email", authController.postCheckEmail);
authRouter.post("/reset-password", authController.postResetPassword);

module.exports = authRouter;
