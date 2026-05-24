import { body, param } from "express-validator";

export const createExperienceValidation = () => [

    body("Company")
        .notEmpty()
        .withMessage("Company is required"),

    body("Designation")
        .notEmpty()
        .withMessage("Designation is required"),

    body("StartDate")
        .notEmpty()
        .withMessage("StartDate is required")
];

export const updateExperienceValidation = () => [
    param("uniqueCode")
        .notEmpty()
        .withMessage("UniqueCode is required")
];