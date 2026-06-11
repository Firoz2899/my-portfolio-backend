import { Router } from "express";

import * as auth from "#controllers/auth.controller.js";
import {authenticateUser} from "#middlewares/auth.middleware.js";
import {
  authValidation,
  validate
} from "#validator/index.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/signup",
  authValidation.signUpValidation(),
  validate,
  auth.signup
);

router.post(
  "/verify-email",
  authValidation.verifyEmailValidation(),
  validate,
  auth.verifyEmail
);

router.post(
  "/resend-otp",
  authValidation.resendOtpValidation(),
  validate,
  auth.resendOtp
);

router.post(
  "/login",
  auth.login
);

router.post(
  "/forgot-password",
  authValidation.forgotPasswordValidation(),
  validate,
  auth.forgotPassword
);

router.post(
  "/reset-password",
  authValidation.resetPasswordValidation(),
  validate,
  auth.resetPassword
);

router.post("/refresh-token", auth.refreshAccessToken);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authenticateUser,
  auth.getLoggedInUser
);

router.post(
  "/logout",
  authenticateUser,
  auth.logout
);

export default router;