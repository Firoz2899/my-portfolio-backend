import { body, param } from "express-validator";

export const updatePortfolioValidation = () => [

    body("FullName")
        .optional()
        .trim(),

    body("Designation")
        .optional()
        .trim(),

    body("Summary")
        .optional()
        .trim(),

    body("AboutMe")
        .optional()
        .trim(),

    body("Email")
        .optional()
        .isEmail()
        .withMessage("Invalid email"),

    body("Phone")
        .optional()
        .trim(),

    body("Location")
        .optional()
        .trim(),

    body("LinkedIn")
        .optional()
        .isURL()
        .withMessage("Invalid LinkedIn URL"),

    body("Github")
        .optional()
        .isURL()
        .withMessage("Invalid Github URL")
];

export const updatePortfolioSlugValidation = () => [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
];