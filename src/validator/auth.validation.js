import {body, check, param} from 'express-validator'
import { regex } from '../constants/constants.js'

export const signUpValidation = () => [
    body("Name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("Email")
        .notEmpty()
        .withMessage("Email is required")
        .matches(regex.Email)
        .withMessage("Invalid Email"),

    body("Password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("PortfolioSlug")
        .trim()
        .notEmpty()
        .withMessage("Portfolio Slug is required")
];

export const verifyEmailValidation = () => [
    body("Email")
        .notEmpty()
        .withMessage("Email is required"),

    body("OTP")
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
];

export const resendOtpValidation = () => [
    body("Email")
        .notEmpty()
        .withMessage("Email is required")
];

export const forgotPasswordValidation = () => [
    body("Email")
        .notEmpty()
        .withMessage("Email is required")
];

export const resetPasswordValidation = () => [
    body("Token")
        .notEmpty()
        .withMessage("Reset token is required"),

    body("Password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
];