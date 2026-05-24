import { body, param } from "express-validator";

export const createSkillValidation = () => [
    body("Title")
        .notEmpty()
        .withMessage("Title is required"),

    body("Percentage")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Percentage must be between 0 and 100")
];

export const updateSkillValidation = () => [
    param("uniqueCode")
        .notEmpty()
        .withMessage("UniqueCode is required")
];