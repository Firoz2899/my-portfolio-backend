import { body, param } from "express-validator";

export const createProjectValidation = () => [

    body("Title")
        .notEmpty()
        .withMessage("Title is required"),

    body("Slug")
        .optional()
        .trim(),

    body("WebsiteUrl")
        .optional()
        .isURL()
        .withMessage("Invalid WebsiteUrl"),

    body("GithubUrl")
        .optional()
        .isURL()
        .withMessage("Invalid GithubUrl")
];

export const updateProjectValidation = () => [
    param("projectCode")
        .notEmpty()
        .withMessage("ProjectCode is required")
];

export const updateProjectSlugValidation = () => [
    param("projectCode")
        .notEmpty(),

    param("slug")
        .notEmpty()
        .withMessage("Slug is required")
];

export const imageValidation = () => [
    param("projectCode")
        .notEmpty()
        .withMessage("ProjectCode is required")
];