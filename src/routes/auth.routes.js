import { Router } from "express";

import * as auth from "../controllers/auth.controller.js";
import {authenticateUser} from "../middlewares/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/signup",
  auth.signup
);

router.post(
  "/verify-email",
  auth.verifyEmail
);

router.post(
  "/resend-otp",
  auth.resendOtp
);

router.post(
  "/login",
  auth.login
);

router.post(
  "/forgot-password",
  auth.forgotPassword
);

router.post(
  "/reset-password",
  auth.resetPassword
);

router.post("/refresh-token", refreshAccessToken);

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