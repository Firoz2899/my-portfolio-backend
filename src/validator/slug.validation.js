import { body, param } from "express-validator";


export const createReservedSlugValidation = () => [

    body("Slug")
        .notEmpty()
        .withMessage("Slug is required"),

    body("SlugType")
        .notEmpty()
        .withMessage("SlugType is required")
        .isIn([
            "PROFILE",
            "PROJECT"
        ])
];

export const updateReservedSlugValidation = () => [
    body("Slug")
        .notEmpty()
        .withMessage("Slug is required"),

    body("SlugType")
        .notEmpty()
        .withMessage("SlugType is required")
        .isIn([
            "PROFILE",
            "PROJECT"
        ]),

    body("Description")
        .optional()
];