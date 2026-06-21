import { body, param } from "express-validator";

export const createSkillValidation = () => [
    body("Title")
        .notEmpty()
        .withMessage("Title is required"),

    body("Icon")
        .notEmpty()
        .withMessage("Icon is required")
];

export const createSubSkillValidation = () => [
    body("Name")
        .notEmpty()
        .withMessage("Name is required"),

    body("Percentage")
        .optional()
        .isInt({ min: 0, max: 100 })
        .default(80)
        .withMessage("Percentage must be between 0 and 100")
];