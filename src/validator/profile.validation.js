import { body, param } from "express-validator";
import {LanguageLevel} from '#constants/constants.js'

export const updateProfileValidation = () => [

    body("FullName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("FullName cannot be empty"),

    body("Email")
        .trim()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),

    body("Phone")
        .optional()
        .trim(),

    body("Designation")
        .optional()
        .trim(),

    body("Hobbies")
        .optional()
        .isArray()
        .withMessage("Hobbies must be an array"),

    body("Hobbies.*")
        .optional()
        .isString()
        .trim(),

    body("Language")
        .optional()
        .isArray()
        .withMessage("Language must be an array"),

    body("Language.*")
        .optional()
        .isObject()
        .trim(),

    body("Language.*.Name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Language name is required"),

    body("Language.*.Level")
        .optional()
        .isIn(Object.values(LanguageLevel))
        .withMessage("Invalid language level"),

    body("Availability")
        .optional()
        .trim(),

    body("Summary")
        .optional()
        .trim(),

    body("AboutMe")
        .optional()
        .trim(),

    body("Address")
        .optional()
        .isObject()
        .withMessage("Address must be an object"),
    
        
    body("Address.AddressLine1")
        .optional()
        .trim(),

    body("Address.AddressLine2")
        .optional()
        .trim(),

    body("Address.Country")
        .optional()
        .trim(),

    body("Address.State")
        .optional()
        .trim(),

    body("Address.City")
        .optional()
        .trim(),

    body("Address.Pincode")
        .optional()
        .trim(),
];

export const updateProfileSlugValidation = () => [
    param("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
];