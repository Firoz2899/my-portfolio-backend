import { body, param } from "express-validator";

export const createExperienceValidation = () => [

    body("Company")
        .notEmpty()
        .withMessage("Company is required"),

    body("Position")
        .notEmpty()
        .withMessage("Position is required"),

    body("StartDate")
        .notEmpty()
        .withMessage("StartDate is required")
];