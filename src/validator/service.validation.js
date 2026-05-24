import { body, param } from "express-validator";

export const createServiceValidation = () => [

    body("Title")
        .notEmpty()
        .withMessage("Title is required"),

    body("Description")
        .notEmpty()
        .withMessage("Description is required"),

    body("Icon")
        .notEmpty()
        .withMessage("Icon is required")
];

export const updateServiceValidation = () => [
    param("uniqueCode")
        .notEmpty()
        .withMessage("UniqueCode is required")
];