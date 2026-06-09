import { param } from "express-validator";

export const updateDefaultProfileValidation = () => [
    param("profileCode")
        .notEmpty()
        .withMessage("Profile code is required")
];