import { body, param } from "express-validator";

export const createReservedSlugValidation = () => [

    body("Slug")
        .notEmpty()
        .withMessage("Slug is required"),

    body("SlugType")
        .notEmpty()
        .withMessage("SlugType is required")
        .isIn([
            "PORTFOLIO",
            "PROJECT"
        ])
];

export const updateReservedSlugValidation = () => [
    param("uniqueCode")
        .notEmpty()
        .withMessage("UniqueCode is required")
];